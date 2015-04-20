'use strict'

var updateOne = require('./helpers/update-one')
var updateMany = require('./helpers/update-many')

module.exports = function remove (objectsOrIds) {
  return Array.isArray(objectsOrIds) ?
    updateMany.call(this, objectsOrIds, {_deleted: true}) :
    updateOne.call(this, objectsOrIds, {_deleted: true})
}
