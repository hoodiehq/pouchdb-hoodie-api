var toId = require('./to-id')
var findOne = require('./find-one')
var addOne = require('./add-one')

module.exports = function findOrAddOne (state, idOrObject, newObject) {
  var id = toId(idOrObject)

  if (!id) return state.Promise.reject(state.errors.MISSING_ID)

  if (idOrObject === id && !newObject) {
    return state.Promise.reject(state.errors.MISSING_ID)
  }

  return findOne(state, id)
  .catch(function (/*error*/) {
    if (typeof newObject === 'object') {
      newObject.id = id
    } else {
      newObject = idOrObject
    }

    return addOne(state, newObject)
  })
}
