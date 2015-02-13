'use strict'

var toObject = require('./utils/to-object')
var toDoc = require('./utils/to-doc')
var extend = require('pouchdb-extend')

module.exports = function update (idOrObject, change) {
  var db = this.db
  var doc
  var id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject

  if (!change) {
    if (typeof idOrObject === 'object') {
      change = extend({}, idOrObject)
      delete change._rev
    } else {
      return new this.PouchDB.utils.Promise(function (resolve, reject) {
        reject(new Error('Must provide change'))
      })
    }
  }

  return db.get(id)

  .then(function(_doc) {
    doc = _doc

    if (typeof change === 'function') {
      var object = toObject(doc)
      change(object)
      doc = toDoc(object)
    } else {
      extend(doc, change)
    }

    return db.put(doc)
  })

  .then(function(response) {
    doc._rev = response.rev
    return doc
  })

  .then(toObject)
}
