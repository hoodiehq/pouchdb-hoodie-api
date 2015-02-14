'use strict'

var toObject = require('./utils/to-object')

module.exports = function findAll (filter) {
  return this.db.allDocs({
    include_docs: true
  })

  .then(function (res) {
    var objects = res.rows.map(function (row) {
      return toObject(row.doc)
    })

    return typeof filter === 'function' ? objects.filter(filter) : objects
  })
}
