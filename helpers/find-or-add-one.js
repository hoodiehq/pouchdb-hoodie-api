var toId = require('../utils/to-id')
var findOne = require('./find-one')
var addOne = require('./add-one')

module.exports = function findOrAddOne (idOrObject, newObject) {
  var self = this
  var Promise = this.constructor.utils.Promise
  var errors = this.constructor.Errors
  var id = toId(idOrObject)

  if (!id) {
    return Promise.reject(errors.MISSING_ID)
  }

  if (idOrObject === id && !newObject) {
    return Promise.reject(errors.MISSING_ID)
  }

  return findOne.call(this, id)

  .catch(function (/*error*/) {
    if (typeof newObject === 'object') {
      newObject.id = id
    } else {
      newObject = idOrObject
    }

    return addOne.call(self, newObject)
  })
}
