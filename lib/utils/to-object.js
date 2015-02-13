'use strict'

var extend = require('pouchdb-extend')

module.exports = function (doc) {
  var object = extend({}, doc, {
    id: doc._id
  })

  delete object._id
  return object
}
