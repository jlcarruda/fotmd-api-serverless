const { app, serverless } = require('../header')
const { sign } = require('../utils/jwt')
const { FailedAuthError, FailedSignUpError } = require('../errors')
const { ErrorHandler, responseWrapper, setResourceTypes } = require('../middlewares')

const { User } = require('../models')

app.post('/tokens',setResourceTypes('users', 'tokens') , async (req, res, next) => {
  const { username } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user) throw new FailedAuthError("Credenciais inválidas")
    const okPassword = await user.comparePassword(req.body.password)
    if (!okPassword) throw new FailedAuthError("Credenciais inválidas")
    const token = sign({
      username: user.username
    })

    responseWrapper(
      {
        req,
        res,
        next
      }, {
        data: {
          token
        }
      }
    )
  } catch (error) {
    next(error)
  }
})

app.post('/users', setResourceTypes('users'), async (req, res, next) => {
  const { username } = req.body

  try {
    const user = await User.findOne({ username })
    if (user) throw new FailedSignUpError("Nome de usuário inválido ou em uso")

    const userCreated = await User.create({
      username,
      password: req.body.password
    })

    const token = sign({
      username
    })

    const { password, _v, ...data } = userCreated._doc
    responseWrapper({
      req, res, next
    },{
      data
    },{
      token
    })
  } catch(error) {
    next(error)
  }
})

app.use(ErrorHandler)

module.exports.handler = serverless(app)