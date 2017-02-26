'use strict'

var toObject = require('./utils/to-object')
var isntDesignDoc = require('./utils/isnt-design-doc')

module.exports = findAll

/**
 * finds all existing objects in local database.
 *
 * @param  {String}   prefix     optional id prefix
 * @param  {Function} [filter]   Function returning `true` for any object
 *                               to be returned.
 * @return {Promise}
 */

function findAll (state, prefix, filter) {
  var options = {
    include_docs: true
  }

  if (prefix) {
    options.startkey = prefix
    options.endkey = prefix + '\uffff'
  }

  return state.db.allDocs(options)

  .then(function (res) {
    var objects = res.rows
      .filter(isntDesignDoc)
      .map(function (row) {
        return toObject(row.doc)
      })

    return typeof filter === 'function'
      ? objects.filter(filter)
      : objects
  })
}
