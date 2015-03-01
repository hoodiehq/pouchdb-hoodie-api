'use strict'

var toId = require('./utils/to-id')
var findOne = require('./utils/find-one')
var addOne = require('./utils/add-one')
var findMany = require('./utils/find-many')
var addMany = require('./utils/add-many')

module.exports = function findOrAdd (idOrObjectOrArray, newObject) {
  var state = {
    db: this.db,
    Promise: this.PouchDB.utils.Promise,
    errors: this.PouchDB.Errors
  }
  var isArray = Array.isArray(idOrObjectOrArray)

  return isArray ? findOrAddMany(state, idOrObjectOrArray) : findOrAddOne(state, idOrObjectOrArray, newObject)
}

function findOrAddMany (state, passedObjects) {
  var foundObjects
  var passedObjectIds = passedObjects.map(toId)

  return findMany(state, passedObjectIds)

  .then(function (_foundObjects) {
    foundObjects = _foundObjects

    var foundObjectIds = foundObjects.map(toId)
    var notFoundObjects = passedObjects.reduce(function (notFoundObjects, passedObject) {
      if (foundObjectIds.indexOf(passedObject.id) === -1) {
        notFoundObjects.push(passedObject)
      }
      return notFoundObjects
    }, [])

    return addMany(state, notFoundObjects)
  })

  .then(function (addedObjects) {
    var objects = []

    foundObjects.concat(addedObjects).forEach(function (object) {
      var index = passedObjectIds.indexOf(object.id)
      objects[index] = object
    })

    return objects
  })
}

function findOrAddOne (state, idOrObject, newObject) {
  var id = toId(idOrObject)

  if (!id) return state.Promise.reject(state.errors.MISSING_ID)

  if (idOrObject === id && !newObject) {
    return state.Promise.reject(state.errors.MISSING_ID)
  }

  return findOne(state, id)
  .catch(function (/*error*/) {
    if (typeof newObject === 'object') {
      newObject.id = id
    } else {
      newObject = idOrObject
    }

    return addOne(state, newObject)
  })
}
