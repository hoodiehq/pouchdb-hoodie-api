'use strict'

var PouchDB = process.browser ? global.PouchDB : require('pouchdb')

if (!PouchDB.prototype.hoodieApi) PouchDB.plugin(require('../../'))

var options = process.browser ? {
  adapter: 'memory'
} : {
  db: require('memdown')
}

module.exports = function () {
  return new PouchDB(uniqueName(), options)
}

var uniqueNr = 0
function uniqueName () {
  uniqueNr += 1
  return 'db-' + uniqueNr
}
