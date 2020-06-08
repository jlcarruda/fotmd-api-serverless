require('dotenv').config()
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')

const { payloadValidator } = require('./middlewares/jsonapi')
const { DBConnection } = require('./middlewares')
const { BadRequestError } = require('./errors')
const { MachineModel } = require('./models')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: "application/vnd.api+json" }))
app.use(helmet())

// JSON API content-type required header
app.use((req, res, next) => {
  const { accept } = req.headers
  const contentType = req.headers["content-type"]
  res.set('Content-Type', 'application/vnd.api+json')
  if (accept !== "application/vnd.api+json" || contentType !== "application/vnd.api+json") {
    return next(new BadRequestError("Accept or/and Content-Type Headers are missing or incorrect"))
  }
  next()
})

app.use(DBConnection)

module.exports = { app, serverless }