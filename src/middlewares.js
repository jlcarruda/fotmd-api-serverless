const ErrorHandler = require('./middlewares/error-handler')

const { DBConnection } = require('./middlewares/database')
const { needsAuthorization } = require('./middlewares/authorization')

module.exports = {
  DBConnection,
  needsAuthorization,
  ErrorHandler
}