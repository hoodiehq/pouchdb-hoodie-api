var toId = require('../utils/to-id')
var addOne = require('./add-one')
var updateOne = require('./update-one')

module.exports = function updateOrAddOne (idOrObject, newObject, prefix) {
  var self = this
  return updateOne.call(this, idOrObject, newObject, prefix)

  .catch(function (error) {
    if (error.status !== 404) {
      throw error
    }

    if (newObject) {
      newObject.id = toId(idOrObject)
      return addOne.call(self, newObject, prefix)
    }

    return addOne.call(self, idOrObject, prefix)
  })
}
