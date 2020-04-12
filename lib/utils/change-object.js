'use strict'

var clone = require('pouchdb-utils').clone

/**
  * change object either by passing changed properties
  * as an object, or by passing a change function that
  * manipulates the passed object directly
  **/
module.exports = function changeObject (change, object) {
  if (typeof change === 'object') {
    Object.getOwnPropertyNames(change).forEach(function (key) {
      var value = clone(change[key])
      if (typeof value !== 'undefined') {
        object[key] = value
      }
    })
    return object
  }

  change(object)
  return object
}
