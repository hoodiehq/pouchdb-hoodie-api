'use strict'

var addOne = require('./helpers/add-one')
var addMany = require('./helpers/add-many')

module.exports = add

/**
 * adds one or multiple objects to local database
 *
 * @param  {Object|Object[]} properties   Properties of one or
 *                                        multiple objects
 * @return {Promise}
 */
function add (objects) {
  return Array.isArray(objects)
    ? addMany.call(this, objects)
    : addOne.call(this, objects)
}
