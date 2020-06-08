const { app, serverless } = require('./src/header')

app.get('/', async (req, res) => {
  res.send({
    message: 'Go Serverless v1.0! Your function executed successfully!'
  })
})

module.exports.migrate = serverless(app)
