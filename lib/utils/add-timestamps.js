'use strict'

var now = require('./now')

module.exports = function addTimestamps (doc) {
  if (!doc.hoodie) {
    doc.hoodie = {}
  }

  if (doc.hoodie.createdAt) {
    doc.hoodie.updatedAt = now()
  } else {
    doc.hoodie.createdAt = now()
  }

  if (doc._deleted) {
    doc.hoodie.deletedAt = doc.hoodie.deletedAt || doc.hoodie.updatedAt
  }

  return doc
}
