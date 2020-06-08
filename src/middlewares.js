const ErrorHandler = require('./middlewares/error-handler')

const { DBConnection } = require('./middlewares/database')
const { needsAuthorization } = require('./middlewares/authorization')
const { payloadValidator, responseWrapper, setResourceTypes } = require('./middlewares/jsonapi')

module.exports = {
  DBConnection,
  needsAuthorization,
  ErrorHandler,
  payloadValidator,
  responseWrapper,
  setResourceTypes
}