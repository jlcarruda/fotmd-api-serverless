const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const { CustomError, BadRequestError } = require('../errors')
const { ModelsByResourceType, ResourceTypesByModel, ResourceTypes } = require('../enums')
const { ObjectId } = mongoose.Types

function isValidId(id) {
  try {
    const oId = ObjectId(id)
    if (oId) return true
    return false
  } catch (error) {
    return false
  }
}

function isRelation(type) {
  return ['ObjectId', ObjectId].includes(type)
}

function validateResourceObject(attributes, resourceType) {
  try {
    let relationships = []
    const resourceModel = mongoose.models[ModelsByResourceType[resourceType]]
    if (resourceModel) {
      const { schema } = resourceModel
      const schemaKeys = Object.keys(schema.obj)

      relationships = schemaKeys.filter(k => {
        if (k === '_id') return false
        let attributeValue = schema.obj[k]

        return isRelation(attributeValue.type) || (Array.isArray(attributeValue) && isRelation(attributeValue[0].type))
      }).map(relationKey => {
        const attribute = attributes[relationKey]
        delete attributes[relationKey]
        if (!attribute || attribute.length === 0) return
        const { _id, ...relAttributes } = attribute
        const schemaRelation = schema.obj[relationKey]

        let type;
        if (Array.isArray(schemaRelation)) {
          type = ResourceTypesByModel[schemaRelation[0].ref]
        } else {
          type = ResourceTypesByModel[schemaRelation.ref]
        }

        return {
          type,
          id: _id,
          attributes: relAttributes
        }
      }).filter(relation => relation !== undefined)
    }

    const respObj = {
      attributes
    }

    if (relationships && relationships.length > 0) {
      respObj.relationships = relationships
    }

    return respObj
  } catch (error) {
    console.error('Error on JSON API Wrapper validateResourceObject: ', error)
  }
}

function mountResponseObject(data, resourceType) {
  const { _id, ...attributes } = data

  if (_id && !isValidId(_id)) throw new Error("Data passed seems to be corrupted or incomplete")

  const resourceObject = validateResourceObject(attributes, resourceType)

  const response = {
    data: {
      id: _id || undefined,
      type: resourceObject.type || resourceType,
      attributes: resourceObject.attributes,
      relationships: resourceObject.relationships || undefined
    }
  }

  return response
}

/**
 * It wraps the database result from a query into a properly JSON:API response, with data, relationships, etc
 * @param {Object} middleware The middleware functions (req, res, next)
 * @param {Object} resourceParams Parameters that describes the resource
 * @param {*} meta JSON:API Meta object to be added into the response
 */
function responseWrapper ({ req, res, next }, { data, resourceType = null, successStatus = 200 }, meta) {
  try {
    console.log("resourceType", req.resourceType)
    if (!req || !res || !next || !data || (!resourceType && req && !req.resourceType)) throw new Error("Wrong or missing arguments for responseWrapper")

    if (!resourceType) resourceType = req.resourceType

    let respObject

    if (!Array.isArray(data)) {
      respObject = mountResponseObject(data, resourceType)
    } else {
      respObject = {
        data: data.map(doc => ({ ...mountResponseObject(doc, resourceType).data }))
      }
    }

    if (meta){
      respObject = {
        ...respObject,
        meta
      }
    }

    res.status(successStatus).json(respObject)
  } catch (error) {
    if (error instanceof CustomError) return next(error)
    throw error
  }
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

/**
 * A Express middleware to check if the payload passed through the body is valid or not
 * @param {Object} req Express Request object
 * @param {Function} res Express Response function
 * @param {Function} next Express next function
 */
function payloadValidator(req, res, next) {
  if (isEmptyObject(req.body) && isEmptyObject(req.params)) return next()

  if (!isEmptyObject(req.body)) {
    const payloadSchema = Joi.object({
      data: Joi.object({
        id: Joi.string().allow(null),
        type: Joi.string().required().valid(...ResourceTypes),
        attributes: Joi.object()
      })
    })
    const { error } = payloadSchema.validate(req.body)
    if (error) return next(new BadRequestError("Invalid payload"))

    const { type, id, attributes } = req.body.data
    if (type !== req.resourceType) return next(new BadRequestError("Resource Types mismatch"))

    req.body = attributes

    if (id) req.body.id = id
  }

  if (!isEmptyObject(req.params)) {
    const paramsSchema = Joi.object({
      filter: Joi.object().allow(null),
      sort: Joi.string().allow(null),
      page: Joi.number().allow(null),
      id: Joi.number().allow(null)
    })

    const { error } = paramsSchema.validate(req.params)
    if (error) return next(new BadRequestError("Invalid query parameters"))
  }

  next()
}

function setResourceTypes(inResourceType, outResourceType = null) {
  return [(req, res, next) => {
    if (!inResourceType) {
      throw new Error("Wrong or missing arguments for setResourceTypes")
    } else if (!ResourceTypes.includes(inResourceType) || !ResourceTypes.includes(outResourceType)) {
      return next(Error(`Resource types passed to setResourceTypes are not allowed. Expected [${ResourceTypes}]. Received '${inResourceType}' and '${outResourceType}'`))
    }
    req.responseResourceType = outResourceType || inResourceType
    req.resourceType = inResourceType
    next()
  }, payloadValidator]
}

module.exports = {
  responseWrapper,
  setResourceTypes,
  payloadValidator
}