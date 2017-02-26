'use strict'

var addOne = require('./helpers/add-one')
var addMany = require('./helpers/add-many')

module.exports = add

/**
 * adds one or multiple objects to local database
 *
 * @param  {String}          prefix       optional id prefix
 * @param  {Object|Object[]} properties   Properties of one or
 *                                        multiple objects
 * @return {Promise}
 */
function add (state, prefix, objects) {
  return Array.isArray(objects)
    ? addMany(state, objects, prefix)
    : addOne(state, objects, prefix)
}
