'use strict'

var updateOne = require('./helpers/update-one')
var updateMany = require('./helpers/update-many')

module.exports = function remove (objectsOrIds) {
  var state = {
    db: this.db,
    Promise: this.PouchDB.utils.Promise,
    errors: this.PouchDB.Errors
  }
  var isArray = Array.isArray(objectsOrIds)

  return isArray ? updateMany(state, objectsOrIds, {_deleted: true})
                 : updateOne(state, objectsOrIds, {_deleted: true})
}
