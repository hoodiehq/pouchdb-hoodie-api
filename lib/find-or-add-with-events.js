'use strict'

var findOrAddOne = require('../helpers/find-or-add-one')
var findOrAddMany = require('../helpers/find-or-add-many')

module.exports = findOrAdd

function findOrAdd (state, idOrObjectOrArray, newObject) {
  return Array.isArray(idOrObjectOrArray) ?
    findOrAddMany.call(this, state, idOrObjectOrArray) :
    findOrAddOne.call(this, state, idOrObjectOrArray, newObject)
}
