'use strict'

var clone = require('pouchdb-utils').clone
var PouchDBErrors = require('pouchdb-errors')
var Promise = require('lie')

var changeObject = require('../utils/change-object')
var addTimestamps = require('../utils/add-timestamps')

var findOne = require('./find-one')

module.exports = function updateOne (state, idOrDoc, change, prefix) {
  var doc

  if (typeof idOrDoc === 'string' && !change) {
    return Promise.reject(PouchDBErrors.NOT_AN_OBJECT)
  }

  return findOne(state, idOrDoc, prefix)

    .then(function (doc) {
      if (!change) {
        Object.getOwnPropertyNames(idOrDoc).forEach(function (key) {
          if (key === '_id' || key === '_rev' || key === 'hoodie') return

          var value = clone(idOrDoc[key])
          if (typeof value !== 'undefined') {
            doc[key] = value
          }
        })
        return doc
      }
      return changeObject(change, doc)
    })

    .then(function (_doc) {
      doc = _doc
      return state.db.put(addTimestamps(doc))
    })

    .then(function (response) {
      doc._rev = response.rev
      return doc
    })
}
