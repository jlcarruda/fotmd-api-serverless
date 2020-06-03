const { app, serverless } = require('../header')
const { sign } = require('../utils/jwt')
const { FailedAuthError, FailedSignUpError } = require('../errors')
const { ErrorHandler } = require('../middlewares')

const { User } = require('../models')

app.post('/users/auth', async (req, res, next) => {
  const { username } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user) throw new FailedAuthError("Credenciais inválidas")
    const okPassword = await user.comparePassword(req.body.password)
    if (!okPassword) throw new FailedAuthError("Credenciais inválidas")
    const token = sign({
      username: user.username
    })

    const { _id, password, characters, tables_participating, tables_owned, ...otherAttributes } = user._doc
    res.status(200).json({
      data: {
        type: "users",
        id: _id,
        attributes: {
          ...otherAttributes
        },
        relationships: {
          tables_participating,
          tables_owned,
          characters
        }
      },
      meta: {
        token
      }
    })
  } catch (error) {
    next(error)
  }
})

app.post('/users/signup', async (req, res, next) => {
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

    const { password, _id, characters, tables_participating, tables_owned, ...otherAttributes } = userCreated._doc
    res.status(200).json({
      data: {
        type: "users",
        id: _id,
        attributes: {
          ...otherAttributes
        },
        relationships: {
          tables_participating,
          tables_owned,
          characters
        }
      },
      meta: {
        token
      }
    })
  } catch(error) {
    next(error)
  }
})

app.use(ErrorHandler)

module.exports.handler = serverless(app)