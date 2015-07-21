'use strict'

var toId = require('../utils/to-id')
var toObject = require('../utils/to-object')

module.exports = function findMany (idsOrObjects) {
  var errors = this.constructor.Errors
  var ids = idsOrObjects.map(toId)

  return this.allDocs({keys: ids, include_docs: true})

  .then(function (response) {
    var foundMap = response.rows.reduce(function (map, row) {
      map[row.id] = row.doc
      return map
    }, {})
    var docs = ids.map(function (id) {
      var doc = foundMap[id]
      if (doc) {
        return doc
      }

      return errors.MISSING_DOC
    })

    return docs.map(toObject)
  })
}
