const { app, serverless } = require('../header')
const { isAuthenticated, ErrorHandler }  = require('../middlewares')
const { NotAuthorizedError } = require('../errors')

app.get('/users/characters', isAuthenticated, (req, res, next) => {
  // if (!req.auth || !req.auth.user) return next(new NotAuthorizedError())

  try {
    const characters = req.auth.user.characters || []
    res.status(200).json({
      data: characters.map(c => {
        const { _id, ...attributes } = c
        return {
          type: 'characters',
          id: c._id,
          attributes
        }
      })
    })
  } catch (error) {
    next(error)
  }
})

app.get('/users/characters/:id', isAuthenticated, (req, res) => {
  // if (!req.auth || !req.auth.user) return next(new NotAuthorizedError())
})

app.use(ErrorHandler)

module.exports.handler = serverless(app)