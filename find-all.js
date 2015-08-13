'use strict'

var toObject = require('./utils/to-object')
var filterExcluded = require('./utils/filter-excluded')

module.exports = findAll

/**
 * finds all existing objects in local database.
 *
 * @param  {Function} [filter]   Function returning `true` for any object
 *                               to be returned.
 * @return {Promise}
 */
function findAll (filter) {
  return this.allDocs({
    include_docs: true
  })

  .then(function (res) {
    var objects = res.rows
      .filter(filterExcluded)
      .map(function (row) {
        return toObject(row.doc)
      })

    return typeof filter === 'function' ? objects.filter(filter) : objects
  })
}
