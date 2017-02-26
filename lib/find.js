'use strict'

var findOne = require('./helpers/find-one')
var findMany = require('./helpers/find-many')

module.exports = find

/**
 * finds existing object in local database
 *
 * @param  {String}        prefix       optional id prefix
 * @param  {String|Object} idOrObject   Id of object or object with
 *                                      `.id` property
 * @return {Promise}
 */
function find (prefix, objectsOrIds) {
  return Array.isArray(objectsOrIds)
    ? findMany.call(this, objectsOrIds, prefix)
    : findOne.call(this, objectsOrIds, prefix)
}
