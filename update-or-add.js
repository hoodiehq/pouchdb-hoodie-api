'use strict'

var updateOrAddOne = require('./helpers/update-or-add-one')
var updateOrAddMany = require('./helpers/update-or-add-many')

module.exports = function updateOrAdd (idOrObjectOrArray, newObject) {
  return Array.isArray(idOrObjectOrArray) ?
    updateOrAddMany.call(this, idOrObjectOrArray) :
    updateOrAddOne.call(this, idOrObjectOrArray, newObject)
}
