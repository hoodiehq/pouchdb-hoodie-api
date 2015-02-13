'use strict'

var toObject = require('./utils/to-object')

module.exports = function remove (id) {
  if (typeof id === 'object') id = id.id

  var self = this

  return this.db.get(id)

  .then(function (doc) {
    return self.db.remove(doc).then(toObject)
  })
}
