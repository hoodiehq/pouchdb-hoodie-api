'use strict'

var extend = require('pouchdb-extend')

module.exports = function docToObject (doc) {
  if (doc instanceof Error) {
    return doc
  }

  var object = extend({}, doc, {
    id: doc._id
  })

  delete object._id
  return object
}
