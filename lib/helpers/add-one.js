'use strict'

var PouchDBErrors = require('pouchdb-errors')
var Promise = require('lie')
var utils = require('pouchdb-utils')

var addTimestamps = require('../utils/add-timestamps')

module.exports = function addOne (state, doc, prefix) {
  if (typeof doc !== 'object') {
    return Promise.reject(PouchDBErrors.NOT_AN_OBJECT)
  }

  doc = utils.extend({}, doc)

  if (!doc._id) {
    doc._id = utils.uuid()
  }

  if (prefix) {
    doc._id = prefix + doc._id
  }

  delete doc.hoodie

  return state.db.put(addTimestamps(doc))

  .then(function (response) {
    doc._id = response.id
    doc._rev = response.rev
    return doc
  })

  .catch(function (error) {
    if (error.status === 409) {
      var conflict = new Error('Object with id "' + doc._id + '" already exists')
      conflict.name = 'Conflict'
      conflict.status = 409
      throw conflict
    } else {
      throw error
    }
  })
}
