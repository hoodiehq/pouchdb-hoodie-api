'use strict'

var now = require('./now')

module.exports = function addTimestamps (object) {
  if (object.createdAt) {
    object.updatedAt = now()
  } else {
    object.createdAt = now()
  }

  if (object._deleted) {
    object.deletedAt = object.deletedAt || object.updatedAt
  }

  return object
}
