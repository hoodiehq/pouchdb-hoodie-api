'use strict'

var extend = require('pouchdb-extend')

module.exports = function updateAll (changedProperties) {
  var Promise = this.constructor.utils.Promise

  var type = typeof changedProperties

  if (type !== 'object' && type !== 'function') {
    return Promise.reject(new Error('Must provide object or function'))
  }

  return this.allDocs({
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

  .then(this.bulkDocs.bind(this))

  .then(function (results) {
    return results
  })
}
