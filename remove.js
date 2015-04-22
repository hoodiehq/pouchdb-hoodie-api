'use strict'

var updateOne = require('./helpers/update-one')
var updateMany = require('./helpers/update-many')

module.exports = remove

/**
 * removes existing object
 *
 * @param  {Object|Function} change   changed properties or function that
 *                                    alters passed object
 * @return {Promise}
 */
function remove (objectsOrIds) {
  return Array.isArray(objectsOrIds) ?
    updateMany.call(this, objectsOrIds, {_deleted: true}) :
    updateOne.call(this, objectsOrIds, {_deleted: true})
}
