class FailedAuthError extends Error {
  id = '55477ce9-49f9-4ee7-b732-9d1e0b8cdad9'
  code = 'ER-401-AUTH-01'
}

class FailedSignUpError extends Error {
  id = '89481b98-eb84-49ff-bc0c-7e4bdcb7d15b'
  code = 'ER-401-SIGNUP-01'
}

module.exports = {
  FailedAuthError,
  FailedSignUpError
}