const { NotAuthorizedError } = require('../errors')
const { validate } = require('../utils/jwt')
const { User } = require('../models')

async function isAuthenticated(req){
  const { authorization } = req.headers
  const token = (authorization && authorization.match(/[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) || [])[0]

  if (!token) {
    return Promise.reject(new NotAuthorizedError("Não Autorizado"))
  }

  try {
    const decoded = await validate(token)
    const { username } = decoded

    const user = await User.findOne({ username }).select('-password').lean()

    return Promise.resolve(user)
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports.needsAuthorization = async (req, res, next) => {
  try {
    const user = await isAuthenticated(req)

    if (!user) return next(new NotAuthorizedError("Autenticação inválida"))

    req.auth = { user }
    next()
  } catch (error) {
    next(error)
  }
}