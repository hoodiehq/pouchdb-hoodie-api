'use strict'

var toId = require('../utils/to-id')

module.exports = function findOne (state, idOrObject, prefix) {
  var id = toId(idOrObject)

  if (prefix && id.substr(0, prefix.length) !== prefix) {
    id = prefix + id
  }

  return state.db.get(id)

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
