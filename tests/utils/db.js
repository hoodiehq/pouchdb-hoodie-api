'use strict'

var PouchDB = process.browser ? global.PouchDB : require('pouchdb')
var hoodieApi = require('../../')
var uuid = PouchDB.utils.uuid

module.exports = function (name) {
  name = name || uuid(10)

  var options = process.browser ? {
    adapter: 'memory'
  } : {
    db: require('memdown')
  }

  PouchDB.plugin(hoodieApi)

  return new PouchDB(name, options)
}
