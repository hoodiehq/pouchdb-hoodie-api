'use strict'

var extend = require('pouchdb-extend')
var PouchDBErrors = require('pouchdb-errors')
var Promise = require('lie')

var changeObject = require('../utils/change-object')
var toDoc = require('../utils/to-doc')
var addTimestamps = require('../utils/add-timestamps')

var findOne = require('./find-one')

module.exports = function updateOne (idOrObject, change) {
  var self = this
  var object

  if (typeof idOrObject === 'string' && !change) {
    return Promise.reject(PouchDBErrors.NOT_AN_OBJECT)
  }

  return findOne.call(this, idOrObject)

  .then(function (object) {
    if (!change) {
      return extend(object, idOrObject)
    }
    return changeObject(change, object)
  })

  .then(function (_object) {
    object = _object
    return self.put(toDoc(addTimestamps(object)))
  })

  .then(function (response) {
    object._rev = response.rev
    return object
  })
}
