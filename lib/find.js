'use strict'

var toObject = require('./utils/to-object')

module.exports = function find (objectsOrIds) {
  var isArray = Array.isArray(objectsOrIds)
  var ids
  var errors = this.PouchDB.Errors
  var Promise = this.PouchDB.utils.Promise

  if (!isArray) {
    objectsOrIds = [objectsOrIds]
  }

  ids = objectsOrIds.map(function (objectOrId) {
    return typeof objectOrId === 'object' ? objectOrId.id : objectOrId
  })

  return this.db.allDocs({keys: ids, include_docs: true})

  .then(function (response) {
    if (!isArray) {
      if (response.rows[0].doc) {
        return toObject(response.rows[0].doc)
      } else {
        return new Promise(function (resolve, reject) {
          reject(errors.MISSING_DOC)
        })
      }
    }

    var docs = []

    response.rows.forEach(function (row) {
      var index = ids.indexOf(row.id)
      docs[index] = row.doc
    })

    return docs.map(toObject)
  })
}
