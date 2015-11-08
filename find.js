'use strict'

var findOne = require('./helpers/find-one')
var findMany = require('./helpers/find-many')

module.exports = find

/**
 * finds existing object in local database
 *
 * @param  {String|Object} idOrObject   Id of object or object with
 *                                      `.id` property
 * @return {Promise}
 */
function find (objectsOrIds) {
  return Array.isArray(objectsOrIds)
    ? findMany.call(this, objectsOrIds)
    : findOne.call(this, objectsOrIds)
}
