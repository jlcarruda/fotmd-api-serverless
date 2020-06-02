const sls = require('serverless-http')
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send({
    message: 'Go Serverless v1.0! Your function executed successfully!'
  })
})

module.exports.hello = sls(app)
