'use strict'

var extend = require('pouchdb-extend')

var toObject = require('./utils/to-object')
var toDoc = require('./utils/to-doc')
var toId = require('./utils/to-id')

module.exports = function update (idOrObject, change) {
  var Promise = this.PouchDB.utils.Promise

  if (typeof idOrObject !== 'object' && !change) {
    return Promise.reject(new Error('Must provide change'))
  }

  var state = { db: this.db }
  var id = toId(idOrObject)

  if (!change) {
    change = extend({}, idOrObject)
    delete change._rev
  }

  return updateOne(state, id, change)
}

function updateOne (state, id, change) {
  var doc

  return state.db.get(id)

  .then(function (_doc) {
    doc = updateDocProperties(_doc, change)
    return state.db.put(doc)
  })

  .then(function (response) {
    doc._rev = response.rev
    return doc
  })

  .then(toObject)
}

function updateDocProperties (doc, change) {
  if (typeof change === 'object') {
    return extend(doc, change)
  }

  // change function explains object as input, so we have to
  // transform it before and afterwards
  var object = toObject(doc)
  change(object)
  return toDoc(object)
}
