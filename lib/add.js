'use strict'

var addOne = require('./helpers/add-one')
var addMany = require('./helpers/add-many')

module.exports = function add (objects) {
  return Array.isArray(objects) ?
    addMany.call(this, objects) :
    addOne.call(this, objects)
}
