'use strict'

var extend = require('pouchdb-extend')

var changeObject = require('./change-object')
var toDoc = require('./to-doc')
var toObject = require('./to-object')
var findOne = require('./find-one')

module.exports = function updateOne (state, idOrObject, change) {
  var object

  return findOne(state, idOrObject)

  .then(function (object) {
    if (!change) return extend(object, idOrObject)

    return changeObject(change, object)
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
