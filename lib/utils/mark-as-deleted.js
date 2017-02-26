'use strict'

var extend = require('pouchdb-utils').extend
var changeObject = require('./change-object')

// Normalizes objectOrId, applies changes if any, and mark as deleted
module.exports = function markAsDeleted (change, objectOrId) {
  var object = typeof objectOrId === 'string' ? { _id: objectOrId } : objectOrId

  if (change) {
    changeObject(change, object)
  }

  return extend({_deleted: true}, object)
}
