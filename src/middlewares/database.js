const mongoose = require('mongoose')

module.exports.DBConnection = (req, res, next) => {
  const { databaseConn } = req
  console.log("Entered Middleware")
  if (databaseConn && databaseConn.db && databaseConn.db.serverConfig && databaseConn.db.serverConfig.isConnected()) {
    console.log("[DB] Connection already exists")
    return next()
  }
  mongoose.connection.on('error', connError => {
    console.error(`[DB] Error while connecting to Database: \n ${connError}`)
    next(connError)
  })

  mongoose.connect(process.env.IS_OFFLINE ? 'mongodb://localhost:27017/dev' : process.env.DB_URL, {
    // Buffering means mongoose will queue up operations if it gets
    // disconnected from MongoDB and send them when it reconnects.
    // With serverless, better to fail fast if not connected.
    bufferCommands: false, // Disable mongoose buffering
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferMaxEntries: 0 // and MongoDB driver buffering
  }).then(() => {
    console.log("Database conn", mongoose.connection.db.serverConfig.isConnected())
    req.databaseConn = mongoose.connection
    next()
  }).catch((error) => {
    console.error(`[DB] Exception on connecting to Database: \n ${error}`)
    next(error)
  })
}