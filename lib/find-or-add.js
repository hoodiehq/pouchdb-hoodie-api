'use strict'

var findOrAddOne = require('./helpers/find-or-add-one')
var findOrAddMany = require('./helpers/find-or-add-many')

module.exports = function findOrAdd (idOrObjectOrArray, newObject) {
  var state = {
    db: this.db,
    Promise: this.PouchDB.utils.Promise,
    errors: this.PouchDB.Errors
  }
  var isArray = Array.isArray(idOrObjectOrArray)

  return isArray ? findOrAddMany(state, idOrObjectOrArray) : findOrAddOne(state, idOrObjectOrArray, newObject)
}
