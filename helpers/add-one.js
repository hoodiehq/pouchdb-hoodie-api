'use strict'

var toDoc = require('../utils/to-doc')
var addTimestamps = require('../utils/add-timestamps')

module.exports = function addOne (object) {
  var Promise = this.constructor.utils.Promise
  var errors = this.constructor.Errors

  if (typeof object !== 'object') {
    return Promise.reject(errors.NOT_AN_OBJECT)
  }

  var method = object.id ? 'put' : 'post'

  return this[method](toDoc(addTimestamps(object)))

  .then(function (response) {
    object.id = response.id
    object._rev = response.rev
    return object
  })
}
