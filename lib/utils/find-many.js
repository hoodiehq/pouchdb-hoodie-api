'use strict'

var toId = require('./to-id')
var toObject = require('./to-object')

module.exports = function findMany (state, idsOrObjects) {
  var ids = idsOrObjects.map(toId)

  return state.db.allDocs({keys: ids, include_docs: true})

  .then(function (response) {
    return response.rows.reduce(function (docs, row) {
      var index = ids.indexOf(row.id)
      docs[index] = row.doc
      return docs
    }, []).map(toObject)
  })
}
