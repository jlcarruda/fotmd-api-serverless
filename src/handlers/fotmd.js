const { app, serverless } = require('../header')
const { FailedAuthError, FailedSignUpError } = require('../errors')
const { ErrorHandler, needsAuthorization } = require('../middlewares')

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
    const systems = await System.find({}).lean()
    res.status(200).json({
      data: systems.map(system => {
        const { _id, ...attributes } = system
        return {
          type: "systems",
          id: _id,
          attributes
        }
      })
    })
  } catch (error) {
    next(error)
  }
})

app.get('/fotmd/systems/:id', needsAuthorization, async (req, res) => {
  const { id } = req.params
  try {
    const system = await System.findOne({ _id: id }).lean()
    const { _id, ...attributes } = system
    res.status(200).json({
      data: {
        type: "systems",
        id: _id,
        attributes
      }
    })
  } catch (error) {
    next(error)
  }
})

app.use(ErrorHandler)

module.exports.handler = serverless(app)