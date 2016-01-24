'use strict'

var toId = require('../utils/to-id')
var toObject = require('../utils/to-object')

module.exports = function findOne (idOrObject) {
  var id = toId(idOrObject)
  return this.get(id)

  .then(toObject)

  .catch(function (error) {
    if (error.status === 404) {
      var missing = new Error('Object with id "' + id + '" is missing')
      missing.name = 'Not found'
      missing.status = 404
      throw missing
    } else {
      throw error
    }
  })
}
