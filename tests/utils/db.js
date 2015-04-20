'use strict'

var PouchDB = process.browser ? global.PouchDB : require('pouchdb')
var uuid = PouchDB.utils.uuid

if (!PouchDB.prototype.hoodieApi) PouchDB.plugin(require('../../'))

var options = process.browser ? {
  adapter: 'memory'
} : {
  db: require('memdown')
}

module.exports = function (name) {
  name = name || uuid(10)

  return new PouchDB(name, options)
}
