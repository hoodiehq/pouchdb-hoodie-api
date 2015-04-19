'use strict'

var findOrAddOne = require('./helpers/find-or-add-one')
var findOrAddMany = require('./helpers/find-or-add-many')

module.exports = function findOrAdd (idOrObjectOrArray, newObject) {
  return Array.isArray(idOrObjectOrArray) ?
    findOrAddMany.call(this, idOrObjectOrArray) :
    findOrAddOne.call(this, idOrObjectOrArray, newObject)
}
