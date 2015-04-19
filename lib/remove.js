'use strict'

var updateOne = require('./utils/update-one')
var updateMany = require('./utils/update-many')

module.exports = function remove (objectsOrIds) {
  var state = {
    db: this.db,
    Promise: this.utils.Promise,
    errors: this.utils.Errors
  }
  var isArray = Array.isArray(objectsOrIds)

  return isArray ? updateMany(state, objectsOrIds, {_deleted: true})
                 : updateOne(state, objectsOrIds, {_deleted: true})
}
