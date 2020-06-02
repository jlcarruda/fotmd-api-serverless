const { DBConnection } = require('./middlewares/database')
const { isAuthenticated } = require('./middlewares/authorization')

module.exports = {
  DBConnection,
  isAuthenticated
}