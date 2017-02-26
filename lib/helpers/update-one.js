'use strict'

var extend = require('pouchdb-utils').extend
var PouchDBErrors = require('pouchdb-errors')
var Promise = require('lie')

var changeObject = require('../utils/change-object')
var toDoc = require('../utils/to-doc')
var addTimestamps = require('../utils/add-timestamps')

var findOne = require('./find-one')

module.exports = function updateOne (state, idOrObject, change, prefix) {
  var object

  if (typeof idOrObject === 'string' && !change) {
    return Promise.reject(PouchDBErrors.NOT_AN_OBJECT)
  }

  return findOne(state, idOrObject, prefix)

  .then(function (object) {
    if (!change) {
      return extend(object, idOrObject, {id: object.id, _rev: object._rev})
    }
    return changeObject(change, object)
  })

  .then(function (_object) {
    object = _object
    return state.db.put(toDoc(addTimestamps(object)))
  })

  .then(function (response) {
    object._rev = response.rev
    return object
  })
}
