const { v4 } = require('uuid')

class CustomError extends Error {
  id = null

  constructor(message) {
    super(message)
    this.id = v4()
  }
}

class FailedAuthError extends CustomError {
  code = 'ER-401-AUTH-01'
}

class NotAuthorizedError extends CustomError {
  code = 'ER-401-AUTH-02'
}
class FailedSignUpError extends CustomError {
  code = 'ER-401-SIGNUP-01'
}

class BadRequestError extends CustomError {
  code = 'ER-400-REQ-01'
}

class InternalServerError extends Error {
  code = 'ER-500-'

  constructor(message) {
    super(message)
    this.id = v4()
  }
}

module.exports = {
  CustomError,
  FailedAuthError,
  NotAuthorizedError,
  FailedSignUpError,
  BadRequestError,
  InternalServerError
}