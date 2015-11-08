'use strict'

var markAsDeleted = require('./utils/mark-as-deleted')

var updateOne = require('./helpers/update-one')
var updateMany = require('./helpers/update-many')

module.exports = remove

/**
 * removes existing object
 *
 * @param  {Object|Function} objectsOrIds   id or object with `.id` property
 * @param  {Object|Function} [change]       Change properties or function that
 *                                          changes existing object
 * @return {Promise}
 */
function remove (objectsOrIds, change) {
  return Array.isArray(objectsOrIds)
    ? updateMany.call(this, objectsOrIds.map(markAsDeleted.bind(null, change)))
    : updateOne.call(this, markAsDeleted(change, objectsOrIds))
}
