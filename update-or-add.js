'use strict'

var updateOrAddOne = require('./helpers/update-or-add-one')
var updateOrAddMany = require('./helpers/update-or-add-many')

module.exports = updateOrAdd

/**
 * updates existing object, or creates otherwise.
 *
 * @param  {String|Object|Object[]} - id or object with `.id` property, or
 *                                    array of properties
 * @param  {Object} [properties]      If id passed, properties for new
 *                                    or existing object
 * @return {Promise}
 */
function updateOrAdd (idOrObjectOrArray, newObject) {
  return Array.isArray(idOrObjectOrArray)
    ? updateOrAddMany.call(this, idOrObjectOrArray)
    : updateOrAddOne.call(this, idOrObjectOrArray, newObject)
}
