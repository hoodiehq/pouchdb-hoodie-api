'use strict'

var findOne = require('./helpers/find-one')
var findMany = require('./helpers/find-many')

module.exports = function find (objectsOrIds) {
  return Array.isArray(objectsOrIds) ?
    findMany.call(this, objectsOrIds) :
    findOne.call(this, objectsOrIds)
}
