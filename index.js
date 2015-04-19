'use strict'

module.exports = { hoodieApi: hoodieApi }

function hoodieApi () {
  var api = {
    db: this,
    utils: {
      Promise: this.constructor.utils.Promise,
      Errors: this.constructor.Errors
    }
  }

  api.add = require('./lib/add').bind(api)
  api.find = require('./lib/find').bind(api)
  api.findAll = require('./lib/find-all').bind(api)
  api.findOrAdd = require('./lib/find-or-add').bind(api)
  api.update = require('./lib/update').bind(api)
  api.updateOrAdd = require('./lib/update-or-add').bind(api)
  api.updateAll = require('./lib/update-all').bind(api)
  api.remove = require('./lib/remove').bind(api)

  return api
}
