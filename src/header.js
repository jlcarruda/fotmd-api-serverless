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
  if (accept !== "application/vnd.api+json") return next(new BadRequestError("Proper Accept Header is missing"))
  res.set('Content-Type', 'application/vnd.api+json')
  next()
})

app.use(DBConnection)

module.exports = { app, serverless }