require('dotenv').config()
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')

const { payloadValidator } = require('./utils/jsonapi')
const { DBConnection } = require('./middlewares')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())

// JSON API content-type required header
app.use((req, res, next) => {
  res.set('Content-Type', 'application/vnd.api+json')
  next()
})

app.use(payloadValidator)

app.use(DBConnection)

module.exports = { app, serverless }