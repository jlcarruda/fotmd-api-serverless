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

  throw err
}
