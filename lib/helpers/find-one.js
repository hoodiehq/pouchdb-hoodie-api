'use strict'

var toId = require('../utils/to-id')
var toObject = require('../utils/to-object')

module.exports = function findOne (state, idOrObject) {
  var id = toId(idOrObject)
  return state.db.get(id).then(toObject)
}
