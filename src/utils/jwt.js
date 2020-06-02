const jwt = require('jsonwebtoken')

const SECRET = process.env.TOKEN_SECRET

module.exports.sign = data => {
  return jwt.sign({
    ...data,
    iss: "http://fotmd.com.br"
  }, SECRET, { algorithm: 'HS512' })
}