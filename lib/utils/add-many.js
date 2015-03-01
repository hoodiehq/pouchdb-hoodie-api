'use strict'

var toDoc = require('./to-doc')

module.exports = function addMany (state, objects) {
  var docs = objects.map(toDoc)

  return state.db.bulkDocs(docs)
  .then(function (responses) {
    return responses.map(function (response, i) {
      if (response instanceof Error) return response

      objects[i].id = response.id
      objects[i]._rev = response.rev
      return objects[i]
    })
  })
}
