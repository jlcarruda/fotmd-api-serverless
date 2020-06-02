const { app, serverless } = require('../header')
const { needsAuthorization, ErrorHandler }  = require('../middlewares')
const { NotAuthorizedError } = require('../errors')

app.get('/users/characters', needsAuthorization, (req, res, next) => {
  if (!req.auth || !req.auth.user) return next(new NotAuthorizedError("Acesso ao recurso solicitado foi negado"))

  try {
    const characters = req.auth.user.characters || []
    res.status(200).json({
      data: characters.map(c => {
        const { _id, owner, ...attributes } = c
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

app.get('/users/characters/:id', needsAuthorization, (req, res, next) => {
  const notAuthError = new NotAuthorizedError("Acesso ao recurso solicitado foi negado")
  if (!req.auth || !req.auth.user) return next(notAuthError)

  try {
    const { id } = req.params
    const filteredResponse = req.auth.user.characters.filter(c => JSON.stringify(c._id) === JSON.stringify(id))
    if (filteredResponse.length > 0) {
      const { _id, ...attributes} = filteredResponse[0]
      return res.status(200).json({
        data: {
          type: 'characters',
          id: _id,
          attributes
        }
      })
    }

    next(notAuthError)
  } catch (error) {
    next(error)
  }
})

app.use(ErrorHandler)

module.exports.handler = serverless(app)