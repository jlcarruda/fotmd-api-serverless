const { JsonWebTokenError } = require('jsonwebtoken')
const { v4 } = require('uuid')

const {
  CustomError,
  FailedSignUpError,
  FailedAuthError,
  NotAuthorizedError
} = require('../errors')

module.exports = (err, req, res, next) => {

  if (err instanceof CustomError) {
    let status = 500
    switch(err.constructor.name) {

      case FailedSignUpError.name:
      case FailedAuthError.name:
      case NotAuthorizedError.name:
        status = 401
        break;
    }

    const { id, message, code } = err
    return res.status(status).json({
      errors: [
        {
          id,
          code,
          title: message
        }
      ]
    })
  }

  if (err instanceof JsonWebTokenError) {
    const anotherError = new NotAuthorizedError("Token de autenticação inválido")
    const { id, message, code } = anotherError
    return res.status(401).json({
      errors: [
        {
          id,
          code,
          message
        },
        {
          id: v4(),
          code: "ER-401-JWTOK-01",
          message: err.message
        }
      ]
    })
  }

  throw err
}
