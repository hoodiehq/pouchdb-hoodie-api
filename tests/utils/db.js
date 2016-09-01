'use strict'

var PouchDB = process.browser ? global.PouchDB : require('pouchdb-memory')

if (!PouchDB.prototype.hoodieApi) {
  PouchDB.plugin(require('../../'))
}

module.exports = function () {
  return new PouchDB(uniqueName())
}

var uniqueNr = 0
function uniqueName () {
  uniqueNr += 1
  return 'db-' + uniqueNr
}
