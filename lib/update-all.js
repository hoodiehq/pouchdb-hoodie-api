'use strict'

var extend = require('pouchdb-extend')

module.exports = function updateAll (changedProperties) {
  var db = this.db

  var type = typeof changedProperties

  if (type !== 'object' && type !== 'function') return new this.PouchDB.utils.Promise(function (resolve, reject) {
    reject(new Error('Must provide object or function'))
  })

  return db.allDocs({
    include_docs: true
  })

  .then(function (res) {
    var docs = res.rows.map(function (row) {
      return row.doc
    })

    if (type === 'function') return docs.map(changedProperties)

    return docs.map(function (doc) {
      return extend(doc, changedProperties)
    })
  })

  .then(db.bulkDocs.bind(db))

  .then(function (results) {
    return results
  })
}
