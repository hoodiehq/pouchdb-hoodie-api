'use strict'

var addOne = require('./utils/add-one')
var addMany = require('./utils/add-many')

module.exports = function add (objects) {
  var isArray = Array.isArray(objects)
  var state = {
    db: this.db,
    Promise: this.utils.Promise,
    errors: this.utils.Errors
  }

  return isArray ? addMany(state, objects) : addOne(state, objects)
}
