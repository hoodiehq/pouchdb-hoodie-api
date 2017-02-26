'use strict'

var uuid = require('pouchdb-utils').uuid

var toDoc = require('../utils/to-doc')
var addTimestamps = require('../utils/add-timestamps')

module.exports = function addMany (state, objects, prefix) {
  objects.forEach(addTimestamps)

  if (prefix) {
    objects.forEach(function (object) {
      if (!object.id) {
        object.id = uuid()
      }

      if (prefix) {
        object.id = prefix + object.id
      }
    })
  }

  var docs = objects.map(toDoc)

  return state.db.bulkDocs(docs)

  .then(function (responses) {
    return responses.map(function (response, i) {
      if (response instanceof Error) {
        if (response.status === 409) {
          var conflict = new Error('Object with id "' + objects[i].id + '" already exists')
          conflict.name = 'Conflict'
          conflict.status = 409
          return conflict
        } else {
          return response
        }
      }

      objects[i].id = response.id
      objects[i]._rev = response.rev
      return objects[i]
    })
  })
}
