'use strict'

var toObject = require('./utils/to-object')

module.exports = function find (id) {
  if (typeof id === 'object') id = id.id

  return this.db.get(id).then(toObject)
}
