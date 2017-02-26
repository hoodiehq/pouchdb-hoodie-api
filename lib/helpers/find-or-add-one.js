module.exports = findOrAddOne

var PouchDBErrors = require('pouchdb-errors')
var Promise = require('lie')

var toId = require('../utils/to-id')
var findOne = require('./find-one')
var addOne = require('./add-one')

function findOrAddOne (state, idOrObject, newObject, prefix) {
  var id = toId(idOrObject)

  if (!id) {
    return Promise.reject(PouchDBErrors.MISSING_ID)
  }

  if (idOrObject === id && !newObject) {
    return Promise.reject(PouchDBErrors.MISSING_ID)
  }

  return findOne(state, id, prefix)

  .catch(function (/* error */) {
    if (typeof newObject === 'object') {
      newObject.id = id
    } else {
      newObject = idOrObject
    }

    if (state) {
      return addOne(state, newObject, prefix)
    }

    return addOne(state, newObject)
  })
}
