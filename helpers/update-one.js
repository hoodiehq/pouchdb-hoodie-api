'use strict'

var extend = require('pouchdb-extend')

var changeObject = require('../utils/change-object')
var toDoc = require('../utils/to-doc')
var findOne = require('./find-one')

module.exports = function updateOne (idOrObject, change) {
  var self = this
  var Promise = this.constructor.utils.Promise
  var errors = this.constructor.Errors
  var object

  if (typeof idOrObject === 'string' && !change) {
    return Promise.reject(errors.NOT_AN_OBJECT)
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
    return self.put(toDoc(object))
  })

  .then(function (response) {
    object._rev = response.rev
    return object
  })
}
