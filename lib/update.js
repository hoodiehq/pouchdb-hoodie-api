'use strict'

var extend = require('pouchdb-extend')

var toObject = require('./utils/to-object')
var toDoc = require('./utils/to-doc')
var toId = require('./utils/to-id')

var findOne = require('./utils/find-one')
var findMany = require('./utils/find-many')

module.exports = function update (objectsOrIds, change) {
  var Promise = this.PouchDB.utils.Promise
  var state = { db: this.db, errors: this.PouchDB.Errors }
  var isArray = Array.isArray(objectsOrIds)

  if (typeof objectsOrIds !== 'object' && !change) {
    return Promise.reject(new Error('Must provide change'))
  }

  return isArray ? updateMany(state, objectsOrIds, change) : updateOne(state, objectsOrIds, change)
}

function updateOne (state, idOrObject, change) {
  var object

  return findOne(state, idOrObject)

  .then(function (object) {
    if (!change) return extend(object, idOrObject)

    return updateObjectProperties(change, object)
  })

  .then(function (_object) {
    object = _object
    return state.db.put(toDoc(object))
  })

  .then(function (response) {
    object._rev = response.rev
    return object
  })

  .then(toObject)
}

function updateMany (state, array, change) {
  var objects
  var ids = array.map(toId)

  return findMany(state, array)

  .then(function (objects) {
    if (change) {
      return objects.map(updateObjectProperties.bind(null, change))
    }

    return objects.map(function (object, index) {
      var passedObject = array[index]
      return extend(object, passedObject)
    })
  })

  .then(function (_objects) {
    objects = _objects
    return state.db.bulkDocs(objects.map(toDoc))
  })

  .then(function (responses) {
    responses.forEach(function (response) {
      var index = ids.indexOf(response.id)
      objects[index]._rev = response.rev
    })

    return objects
  })
}

function updateObjectProperties (change, object) {
  if (typeof change === 'object') {
    return extend(object, change)
  }

  change(object)
  return object
}
