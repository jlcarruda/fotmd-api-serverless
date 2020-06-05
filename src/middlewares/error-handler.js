const { JsonWebTokenError } = require('jsonwebtoken')
const { v4 } = require('uuid')

const {
  CustomError,
  FailedSignUpError,
  FailedAuthError,
  NotAuthorizedError,
  BadRequestError,
  InternalServerError
} = require('../errors')

module.exports = (err, req, res, next) => {

  let status = 500
  if (err instanceof CustomError) {
    switch(err.constructor.name) {

      case FailedSignUpError.name:
      case FailedAuthError.name:
      case NotAuthorizedError.name:
        status = 401
        break;
      case BadRequestError.name:
        status = 400
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

  const error = new InternalServerError("Internal Error. Please try again later or contact the admin")
  const { id, code, message } = error

  res.status(status).json({
    erros: [
      {
        id,
        code,
        message
      }
    ]
  })
  throw error
}
