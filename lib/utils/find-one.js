'use strict'

var toId = require('./to-id')
var toObject = require('./to-object')

module.exports = function findOne (state, idOrObject) {
  var id = toId(idOrObject)
  return state.db.get(id).then(toObject)
}
