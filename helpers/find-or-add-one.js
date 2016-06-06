module.exports = findOrAddOne

var PouchDBErrors = require('pouchdb-errors')
var Promise = require('lie')

var toId = require('../utils/to-id')
var findOne = require('./find-one')
var addOne = require('./add-one')
var eventify = require('./eventify')

function findOrAddOne (state, idOrObject, newObject) {
  var self = this
  var id = toId(idOrObject)

  if (!id) {
    return Promise.reject(PouchDBErrors.MISSING_ID)
  }

  if (idOrObject === id && !newObject) {
    return Promise.reject(PouchDBErrors.MISSING_ID)
  }

  return findOne.call(this, id)

  .catch(function (/* error */) {
    if (typeof newObject === 'object') {
      newObject.id = id
    } else {
      newObject = idOrObject
    }

    if (state) {
      return eventify(self, state, addOne)(newObject)
    }

    return addOne.call(self, newObject)
  })
}
