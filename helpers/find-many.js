'use strict'

var toId = require('../utils/to-id')
var toObject = require('../utils/to-object')

module.exports = function findMany (idsOrObjects) {
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

      var missing = new Error('Object with id "' + id + '" is missing')
      missing.name = 'Not found'
      missing.status = 404
      return missing
    })

    return docs.map(toObject)
  })
}
