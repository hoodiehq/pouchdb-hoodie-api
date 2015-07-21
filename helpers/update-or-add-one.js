var toId = require('../utils/to-id')
var addOne = require('./add-one')
var updateOne = require('./update-one')

module.exports = function updateOrAddOne (idOrObject, newObject) {
  var self = this
  return updateOne.call(this, idOrObject, newObject)

  .catch(function (error) {
    if (error.status !== 404) {
      throw error
    }

    if (newObject) {
      newObject.id = toId(idOrObject)
      return addOne.call(self, newObject)
    }

    return addOne.call(self, idOrObject)
  })
}
