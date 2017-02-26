module.exports = update

var Promise = require('lie')

var updateOne = require('./helpers/update-one')
var updateMany = require('./helpers/update-many')

/**
 * updates existing object.
 *
 * @param  {String}          prefix       optional id prefix
 * @param  {String|Object}   idOrObject   id or object with `._id` property
 * @param  {Object|Function} [change]     Changed properties or function
 *                                        that changes existing object
 * @return {Promise}
 */
function update (state, prefix, objectsOrIds, change) {
  if (typeof objectsOrIds !== 'object' && !change) {
    return Promise.reject(
      new Error('Must provide change')
    )
  }

  return Array.isArray(objectsOrIds)
    ? updateMany(state, objectsOrIds, change, prefix)
    : updateOne(state, objectsOrIds, change, prefix)
}
