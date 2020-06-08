const { app, serverless } = require('../header')
const { ErrorHandler, needsAuthorization, responseWrapper, setResourceTypes} = require('../middlewares')

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

app.use(setResourceTypes('systems'))

app.get('/systems', needsAuthorization, async (req, res, next) => {
  try {
    const data = await System.find({}).lean()
    responseWrapper( {
      req,
      res,
      next
    }, {
      data
    })
  } catch (error) {
    next(error)
  }
})

app.get('/systems/:id', needsAuthorization, async (req, res, next) => {
  const { id } = req.params
  try {
    const data = await System.findOne({ _id: id }).lean()
    responseWrapper( {
      req,
      res,
      next
    }, {
      data
    })
  } catch (error) {
    next(error)
  }
})

app.use(ErrorHandler)

module.exports.handler = serverless(app)