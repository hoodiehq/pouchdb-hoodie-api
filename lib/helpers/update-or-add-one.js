var toId = require('../utils/to-id')
var addOne = require('./add-one')
var updateOne = require('./update-one')

module.exports = function updateOrAddOne (state, idOrObject, newObject, prefix) {
  return updateOne(state, idOrObject, newObject, prefix)

  .catch(function (error) {
    if (error.status !== 404) {
      throw error
    }

    if (newObject) {
      newObject._id = toId(idOrObject)
      return addOne(state, newObject, prefix)
    }

    return addOne(state, idOrObject, prefix)
  })
}
