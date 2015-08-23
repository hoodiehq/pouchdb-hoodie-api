'use strict'

var toObject = require('./utils/to-object')
var toDoc = require('./utils/to-doc')
var isntDesignDoc = require('./utils/isnt-design-doc')
var addTimestamps = require('./utils/add-timestamps')

module.exports = removeAll

/**
 * removes all existing objects
 *
 * @param  {Function} [filter]   Function returning `true` for any object
 *                               to be removed.
 * @return {Promise}
 */
function removeAll (filter) {
  var objects

  return this.allDocs({
    include_docs: true
  })

  .then(function (res) {
    objects = res.rows
      .filter(isntDesignDoc)
      .map(function (row) {
        return toObject(row.doc)
      })

    if (typeof filter === 'function') {
      objects = objects.filter(filter)
    }

    return objects.map(function (object) {
      object._deleted = true
      return toDoc(addTimestamps(object))
    })
  })

  .then(this.bulkDocs.bind(this))

  .then(function (results) {
    return results.map(function (result, i) {
      objects[i]._rev = result.rev
      return objects[i]
    })
  })
}
