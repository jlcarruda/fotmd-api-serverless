const { app, serverless } = require('../header')
const { FailedAuthError, FailedSignUpError } = require('../errors')
const { ErrorHandler, needsAuthorization } = require('../middlewares')
const { responseWrapper } = require('../utils/jsonapi')

const { System } = require('../models')

/**
 * * fotmd
  * GET /fotmd/machine_types
  * GET /fotmd/machine_types/:id
  * GET /fotmd/machine_models
  * GET /fotmd/machine_models/:id
  * GET /fotmd/systems
  * GET /fotmd/systems/:id
  * GET /fotmd/components
  * GET /fotmd/components/:id
 */

app.get('/fotmd/systems', needsAuthorization, async (req, res, next) => {
  try {
    const dbData = await System.find({}).lean()
    responseWrapper( {
      req,
      res,
      next
    }, {
      dbData,
      resourceType: 'systems'
    })
  } catch (error) {
    next(error)
  }
})

app.get('/fotmd/systems/:id', needsAuthorization, async (req, res, next) => {
  const { id } = req.params
  try {
    const dbData = await System.findOne({ _id: id }).lean()
    responseWrapper( {
      req,
      res,
      next
    }, {
      dbData,
      resourceType: 'systems'
    })
  } catch (error) {
    next(error)
  }
})

app.use(ErrorHandler)

module.exports.handler = serverless(app)