'use strict'

var toObject = require('./utils/to-object')

module.exports = function find (objectsOrIds) {
  var isArray = Array.isArray(objectsOrIds)
  var ids
  if (!isArray) {
    objectsOrIds = [objectsOrIds]
  }

  ids = objectsOrIds.map(function(objectOrId) {
    return typeof objectOrId === 'object' ? objectOrId.id : objectOrId
  })

  return this.db.allDocs({ids: ids, include_docs: true})

  .then(function(response) {
    if (!isArray) return toObject(response.rows[0].doc)

    var docs = []

    response.rows.forEach(function(row) {
      var index = ids.indexOf(row.id)
      docs[index] = row.doc
    })

    return docs.map(toObject)
  })
}
