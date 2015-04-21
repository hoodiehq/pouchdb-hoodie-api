'use strict'

var updateOne = require('./helpers/update-one')
var updateMany = require('./helpers/update-many')

/**
 * updates existing object.
 *
 * @param  {String|Object}   idOrObject   id or object with `.id` property
 * @param  {Object|Function} [change]     Changed properties or function
 *                                        that changes existing object
 * @return {Promise}
 */
module.exports = function update (objectsOrIds, change) {
  if (typeof objectsOrIds !== 'object' && !change) {
    return this.constructor.utils.Promise.reject(
      new Error('Must provide change')
    )
  }

  return Array.isArray(objectsOrIds) ?
    updateMany.call(this, objectsOrIds, change) :
    updateOne.call(this, objectsOrIds, change)
}
