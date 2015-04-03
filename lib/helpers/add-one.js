'use strict'

var toDoc = require('../utils/to-doc')

module.exports = function addOne (state, object) {
  if (typeof object !== 'object') {
    return state.Promise.reject(state.errors.NOT_AN_OBJECT)
  }

  var method = object.id ? 'put' : 'post'
  return state.db[method](toDoc(object))
  .then(function (response) {
    object.id = response.id
    object._rev = response.rev
    return object
  })
}
