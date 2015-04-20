'use strict'

var extend = require('pouchdb-extend')

module.exports = function objectToDoc (object) {
  var doc = extend({}, object, {
    _id: object.id
  })

  delete doc.id
  return doc
}
