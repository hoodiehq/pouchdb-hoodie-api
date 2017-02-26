'use strict'

var findOne = require('./helpers/find-one')
var findMany = require('./helpers/find-many')

module.exports = find

/**
 * finds existing object in local database
 *
 * @param  {String}        prefix       optional id prefix
 * @param  {String|Object} idOrObject   Id of object or object with
 *                                      `._id` property
 * @return {Promise}
 */
function find (state, prefix, objectsOrIds) {
  return Array.isArray(objectsOrIds)
    ? findMany(state, objectsOrIds, prefix)
    : findOne(state, objectsOrIds, prefix)
}
