require('dotenv').config()
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')

const { DBConnection } = require('./middlewares')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())

app.use(DBConnection)

module.exports = { app, serverless }