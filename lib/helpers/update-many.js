'use strict'

var extend = require('pouchdb-utils').extend
var PouchDBErrors = require('pouchdb-errors')

var changeObject = require('../utils/change-object')
var addTimestamps = require('../utils/add-timestamps')
var toId = require('../utils/to-id')

var findMany = require('./find-many')

module.exports = function updateMany (state, array, change, prefix) {
  var docs
  var ids = array.map(function (doc) {
    var id = toId(doc)

    if (prefix && id.substr(0, prefix.length) !== prefix) {
      id = prefix + id
    }

    return id
  })

  return findMany(state, array, prefix)

    .then(function (docs) {
      if (change) {
        return docs.map(function (doc) {
          if (doc instanceof Error) {
            return doc
          }
          return changeObject(change, doc)
        })
      }

      return docs.map(function (doc, index) {
        var passedDoc = array[index]
        if (doc instanceof Error) {
          return doc
        }
        if (typeof passedDoc !== 'object') {
          return PouchDBErrors.NOT_AN_OBJECT
        }
        return extend(doc, passedDoc, { _id: doc._id, _rev: doc._rev, hoodie: doc.hoodie })
      })
    })

    .then(function (_docs) {
      docs = _docs
      var validObjects = docs.filter(function (doc) {
        return !(doc instanceof Error)
      })
      validObjects.forEach(addTimestamps)
      return state.db.bulkDocs(validObjects)
    })

    .then(function (responses) {
      responses.forEach(function (response) {
        var index = ids.indexOf(response.id)
        docs[index]._rev = response.rev
      })

      return docs
    })
}
