const jwt = require('jsonwebtoken')

const SECRET = process.env.TOKEN_SECRET
const issuer = "http://fotmd.com.br"

module.exports.sign = data => {
  return jwt.sign({
    ...data,
    iss: issuer,
  }, SECRET, { algorithm: 'HS512' })
}

module.exports.validate = token => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, SECRET, { issuer })
      resolve(decoded)
    } catch (error) {
      return reject(error)
    }
  })
}