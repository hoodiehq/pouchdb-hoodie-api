module.exports = updateAll

var clone = require('pouchdb-utils').clone
var Promise = require('lie')

var addTimestamps = require('./utils/add-timestamps')
var isntDesignDoc = require('./utils/isnt-design-doc')

/**
 * updates all existing docs
 *
 * @param  {String}          prefix   optional id prefix
 * @param  {Object|Function} change   changed properties or function that
 *                                    alters passed doc
 * @return {Promise}
 */

function updateAll (state, prefix, changedProperties) {
  var type = typeof changedProperties
  var docs

  if (type !== 'object' && type !== 'function') {
    return Promise.reject(new Error('Must provide object or function'))
  }

  var options = {
    include_docs: true
  }

  if (prefix) {
    options.startkey = prefix
    options.endkey = prefix + '\uffff'
  }

  return state.db.allDocs(options)

    .then(function (res) {
      docs = res.rows
        .filter(isntDesignDoc)
        .map(function (row) {
          return row.doc
        })

      docs.forEach(addTimestamps)

      if (type === 'function') {
        docs.forEach(changedProperties)
        return docs
      }

      return docs.map(function (doc) {
        Object.getOwnPropertyNames(changedProperties).forEach(function (key) {
          if (key === '_id' || key === '_rev' || key === 'hoodie') return

          var value = clone(changedProperties[key])
          if (typeof value !== 'undefined') {
            doc[key] = value
          }
        })
        return doc
      })
    })

    .then(function (result) {
      return result
    })
    .then(state.db.bulkDocs.bind(state.db))

    .then(function (results) {
      return results.map(function (result, i) {
        docs[i]._rev = result.rev
        return docs[i]
      })
    })
}
