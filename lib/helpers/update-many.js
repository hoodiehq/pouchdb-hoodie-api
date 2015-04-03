'use strict'

var extend = require('pouchdb-extend')

var changeObject = require('../utils/change-object')
var toDoc = require('../utils/to-doc')
var toId = require('../utils/to-id')
var findMany = require('./find-many')

module.exports = function updateMany (state, array, change) {
  var objects
  var ids = array.map(toId)

  return findMany(state, array)

  .then(function (objects) {
    if (change) {
      return objects.map(function (object) {
        if (object instanceof Error) return object
        return changeObject(change, object)
      })
    }

    return objects.map(function (object, index) {
      var passedObject = array[index]
      if (object instanceof Error) return object
      if (typeof passedObject !== 'object') return state.errors.NOT_AN_OBJECT
      return extend(object, passedObject)
    })
  })

  .then(function (_objects) {
    objects = _objects
    var validObjects = objects.filter(function (object) {
      return !(object instanceof Error)
    })
    return state.db.bulkDocs(validObjects.map(toDoc))
  })

  .then(function (responses) {
    responses.forEach(function (response) {
      var index = ids.indexOf(response.id)
      objects[index]._rev = response.rev
    })

    return objects
  })
}
