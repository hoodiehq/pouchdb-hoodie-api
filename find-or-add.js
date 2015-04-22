'use strict'

var findOrAddOne = require('./helpers/find-or-add-one')
var findOrAddMany = require('./helpers/find-or-add-many')

/**
 * tries to find object in local database, otherwise creates new one
 * with passed properties.
 *
 * @param  {String|Object} idOrObject   id or object with `.id` property
 * @param  {Object}        [properties] Optional properties if id passed
 *                                      as first option
 * @return {Promise}
 */
function findOrAdd (idOrObjectOrArray, newObject) {
  return Array.isArray(idOrObjectOrArray) ?
    findOrAddMany.call(this, idOrObjectOrArray) :
    findOrAddOne.call(this, idOrObjectOrArray, newObject)
}

module.exports = findOrAdd
