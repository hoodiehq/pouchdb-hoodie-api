'use strict'

var findOrAddOne = require('../helpers/find-or-add-one')
var findOrAddMany = require('../helpers/find-or-add-many')

module.exports = findOrAdd

/**
 * tries to find object in local database, otherwise creates new one
 * with passed properties. Triggers `add` even if new object created
 *
 * @param  {String|Object} idOrObject   id or object with `.id` property
 * @param  {Object}        [properties] Optional properties if id passed as first option
 * @return {Promise}
 */
function findOrAdd (state, idOrObjectOrArray, newObject) {
  return Array.isArray(idOrObjectOrArray)
    ? findOrAddMany.call(this, state, idOrObjectOrArray)
    : findOrAddOne.call(this, state, idOrObjectOrArray, newObject)
}
