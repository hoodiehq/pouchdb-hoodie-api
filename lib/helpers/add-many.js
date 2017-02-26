'use strict'

var utils = require('pouchdb-utils')

var addTimestamps = require('../utils/add-timestamps')

module.exports = function addMany (state, docs, prefix) {
  docs = docs.map(function (doc) {
    doc = utils.extend({}, doc)
    delete doc.hoodie
    return addTimestamps(doc)
  })

  if (prefix) {
    docs.forEach(function (doc) {
      doc._id = prefix + (doc._id || utils.uuid())
    })
  }

  return state.db.bulkDocs(docs)

  .then(function (responses) {
    return responses.map(function (response, i) {
      if (response instanceof Error) {
        if (response.status === 409) {
          var conflict = new Error('Object with id "' + docs[i]._id + '" already exists')
          conflict.name = 'Conflict'
          conflict.status = 409
          return conflict
        } else {
          return response
        }
      }

      docs[i]._id = response.id
      docs[i]._rev = response.rev
      return docs[i]
    })
  })
}
