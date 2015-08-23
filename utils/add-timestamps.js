'use strict'

var now = require('./now')

module.exports = function addTimestamps (object) {
  object.updatedAt = now()
  object.createdAt = object.createdAt || object.updatedAt

  if (object._deleted) {
    object.deletedAt = object.deletedAt || object.updatedAt
  }

  return object
}
