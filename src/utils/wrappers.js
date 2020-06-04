const mongoose = require('mongoose')
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

function validateResourceObject(attributes, resourceType) {
  try {
    const { schema } = mongoose.models[ModelsByResourceType[resourceType]]
    const schemaKeys = Object.keys(schema.obj)
    console.log('Schema Keys', schemaKeys)
    const relationships = schemaKeys.filter(k => {
      if (k === '_id') return false

      let attributeValue = schema.obj[k]
      console.log('attribute value', attributeValue)

      /**
       * Its a RELATION if
       *
       *   Populated
       *
       *   - Is another Object with _id attribute
       *   - Is array with
       *      - Objects with _id attribute
       *
       *   OR not Populated
       *
       *   - Is a plain ObjectId value, and its not the _id key
       *   - Is array with
       *      - ObjectId s inside
       */
      console.log('its a relation?', ['ObjectId', ObjectId].includes(attributeValue.type) || (Array.isArray(attributeValue) && ['ObjectId', ObjectId].includes(attributeValue[0].type)))

      return ['ObjectId', ObjectId].includes(attributeValue.type) || (Array.isArray(attributeValue) && ['ObjectId', ObjectId].includes(attributeValue[0].type))
    }).map(relationKey => {
      const attribute = attributes[relationKey]
      delete attributes[relationKey]
      if (!attribute) return
      const { _id, ...relAttributes } = attribute
      const schemaRelation = schema.obj[relationKey]
      console.log("relation Key", relationKey)
      console.log("schema relation", schemaRelation)
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

    console.log("relationships", relationships)

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

module.exports.JSONApiResponseWrapper = ({ req, res, next, dbData, resourceType, successStatus = 200 }, meta)  => {
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
