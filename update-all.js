'use strict'

var extend = require('pouchdb-extend')

var toObject = require('./utils/to-object')
var toDoc = require('./utils/to-doc')

module.exports = updateAll

/**
 * updates all existing objects
 *
 * @param  {Object|Function} change   changed properties or function that
 *                                    alters passed object
 * @return {Promise}
 */
function updateAll (changedProperties) {
  var Promise = this.constructor.utils.Promise

  var type = typeof changedProperties
  var objects

  if (type !== 'object' && type !== 'function') {
    return Promise.reject(new Error('Must provide object or function'))
  }

  return this.allDocs({
    include_docs: true
  })

  .then(function (res) {
    objects = res.rows.map(function (row) {
      return toObject(row.doc)
    })

    if (type === 'function') {
      objects.forEach(changedProperties)
      return objects.map(toDoc)
    }

    return objects.map(function (object) {
      extend(object, changedProperties)
      return toDoc(object)
    })
  })

  .then(function (result) {
    return result
  })
  .then(this.bulkDocs.bind(this))

  .then(function (results) {
    return results.map(function (result, i) {
      objects[i]._rev = result.rev
      return objects[i]
    })
  })
}
