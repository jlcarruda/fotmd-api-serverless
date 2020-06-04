const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const { CustomError, BadRequestError } = require('../errors')
const { ModelsByResourceType, ResourceTypes } = require('../enums')
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
    const { schema } = mongoose.models[ModelsByResourceType[resourceType]]
    const schemaKeys = Object.keys(schema.obj)

    const relationships = schemaKeys.filter(k => {
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
        type = ResourceTypes[schemaRelation[0].ref]
      } else {
        type = ResourceTypes[schemaRelation.ref]
      }

      return {
        type,
        id: _id,
        attributes: relAttributes
      }
    }).filter(relation => relation !== undefined)

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

function mountResponseObject(dbData, resourceType) {
  const { _id, ...attributes } = dbData

  if (!(_id && isValidId(_id))) throw new Error("Data passed seems to be corrupted or incomplete")

  const resourceObject = validateResourceObject(attributes, resourceType)

  return {
    data: {
      type: resourceType,
      id: _id,
      attributes: resourceObject.attributes,
      relationships: resourceObject.relationships || undefined
    }
  }
}

/**
 * It wraps the database result from a query into a properly JSON:API response, with data, relationships, etc
 * @param {Object} middleware The middleware functions (req, res, next)
 * @param {Object} resourceParams Parameters that describes the resource
 * @param {*} meta JSON:API Meta object to be added into the response
 */
function responseWrapper ({ req, res, next }, { dbData, resourceType, successStatus = 200 }, meta) {
  try {
    if (!req || !res || !next || !dbData || !resourceType) throw new Error("Wrong or missing arguments for wrapper")

    let respObject

    if (!Array.isArray(dbData)) {
      respObject = mountResponseObject(dbData, resourceType)
    } else {
      respObject = dbData.map(doc => mountResponseObject(doc, resourceType))
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

/**
 * A Express middleware to check if the payload passed through the body is valid or not
 * @param {Object} req Express Request object
 * @param {Function} res Express Response function
 * @param {Function} next Express next function
 */
function payloadValidator(req, res, next) {
  if (!req.body && !req.params) return next()

  if (req.body) {
    console.log("BODY", req.body)
    const payloadSchema = Joi.object({
      data: Joi.object({
        type: Joi.string().required(),
        attributes: Joi.object()
      })
    })

    const { error } = payloadSchema.validate(req.body)
    if (error) return next(new BadRequestError("Invalid payload"))
  }

  if (req.params) {
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

module.exports = {
  responseWrapper,
  payloadValidator
}