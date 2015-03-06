var toId = require('./to-id')
var addOne = require('./add-one')
var updateOne = require('./update-one')

module.exports = function updateOrAddOne (state, idOrObject, newObject) {
  return updateOne(state, idOrObject, newObject)

  .catch(function (error) {
    if (error.status !== 404) throw error

    if (newObject) {
      newObject.id = toId(idOrObject)
      return addOne(state, newObject)
    }

    return addOne(state, idOrObject)
  })
}
