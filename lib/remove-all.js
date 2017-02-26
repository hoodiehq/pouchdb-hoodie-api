'use strict'

var isntDesignDoc = require('./utils/isnt-design-doc')
var addTimestamps = require('./utils/add-timestamps')

module.exports = removeAll

/**
 * removes all existing docs
 *
 * @param  {String}   prefix     optional id prefix
 * @param  {Function} [filter]   Function returning `true` for any doc
 *                               to be removed.
 * @return {Promise}
 */
function removeAll (state, prefix, filter) {
  var docs

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

    if (typeof filter === 'function') {
      docs = docs.filter(filter)
    }

    return docs.map(function (doc) {
      doc._deleted = true
      return addTimestamps(doc)
    })
  })

  .then(state.db.bulkDocs.bind(state.db))

  .then(function (results) {
    return results.map(function (result, i) {
      docs[i]._rev = result.rev
      return docs[i]
    })
  })
}
