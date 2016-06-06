'use strict'

var extend = require('pouchdb-extend')
var PouchDBErrors = require('pouchdb-errors')

var changeObject = require('../utils/change-object')
var toDoc = require('../utils/to-doc')
var addTimestamps = require('../utils/add-timestamps')
var toId = require('../utils/to-id')

var findMany = require('./find-many')

module.exports = function updateMany (array, change) {
  var self = this
  var objects
  var ids = array.map(toId)

  return findMany.call(this, array)

  .then(function (objects) {
    if (change) {
      return objects.map(function (object) {
        if (object instanceof Error) {
          return object
        }
        return changeObject(change, object)
      })
    }

    return objects.map(function (object, index) {
      var passedObject = array[index]
      if (object instanceof Error) {
        return object
      }
      if (typeof passedObject !== 'object') {
        return PouchDBErrors.NOT_AN_OBJECT
      }
      return extend(object, passedObject)
    })
  })

  .then(function (_objects) {
    objects = _objects
    var validObjects = objects.filter(function (object) {
      return !(object instanceof Error)
    })
    validObjects.forEach(addTimestamps)
    return self.bulkDocs(validObjects.map(toDoc))
  })

  .then(function (responses) {
    responses.forEach(function (response) {
      var index = ids.indexOf(response.id)
      objects[index]._rev = response.rev
    })

    return objects
  })
}
