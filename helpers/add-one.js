'use strict'

var PouchDBErrors = require('pouchdb-errors')
var Promise = require('lie')

var toDoc = require('../utils/to-doc')
var addTimestamps = require('../utils/add-timestamps')

module.exports = function addOne (object) {
  if (typeof object !== 'object') {
    return Promise.reject(PouchDBErrors.NOT_AN_OBJECT)
  }

  var method = object.id ? 'put' : 'post'

  return this[method](toDoc(addTimestamps(object)))

  .then(function (response) {
    object.id = response.id
    object._rev = response.rev
    return object
  })

  .catch(function (error) {
    if (error.status === 409) {
      var conflict = new Error('Object with id "' + object.id + '" already exists')
      conflict.name = 'Conflict'
      conflict.status = 409
      throw conflict
    } else {
      throw error
    }
  })
}
