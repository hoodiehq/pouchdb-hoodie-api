'use strict'

var PouchDB = process.browser ? global.PouchDB : require('pouchdb')
var uuid = PouchDB.utils.uuid

module.exports = function (name) {
  name = name || uuid(10)

  var options = process.browser ? {
    adapter: 'memory'
  } : {
    db: require('memdown')
  }

  return new PouchDB(name, options)
}
