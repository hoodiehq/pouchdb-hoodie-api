'use strict'

var extend = require('pouchdb-extend')

var changeObject = require('./change-object')
var toDoc = require('./to-doc')
var toId = require('./to-id')
var findMany = require('./find-many')

module.exports = function updateMany (state, array, change) {
  var objects
  var ids = array.map(toId)

  return findMany(state, array)

  .then(function (objects) {
    if (change) {
      return objects.map(changeObject.bind(null, change))
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
