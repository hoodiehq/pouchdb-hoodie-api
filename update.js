'use strict'

var updateOne = require('./helpers/update-one')
var updateMany = require('./helpers/update-many')

module.exports = function update (objectsOrIds, change) {
  if (typeof objectsOrIds !== 'object' && !change) {
    return this.constructor.utils.Promise.reject(
      new Error('Must provide change')
    )
  }

  return Array.isArray(objectsOrIds) ?
    updateMany.call(this, objectsOrIds, change) :
    updateOne.call(this, objectsOrIds, change)
}
