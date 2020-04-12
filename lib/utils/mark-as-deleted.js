'use strict'

var clone = require('pouchdb-utils').clone
var changeObject = require('./change-object')

// Normalizes objectOrId, applies changes if any, and mark as deleted
module.exports = function markAsDeleted (change, objectOrId) {
  var object = typeof objectOrId === 'string' ? { _id: objectOrId } : objectOrId

  if (change) {
    changeObject(change, object)
  }

  var deleted = clone(object)
  deleted._deleted = true

  return deleted
}
