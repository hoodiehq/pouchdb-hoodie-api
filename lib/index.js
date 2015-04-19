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

  api.add = require('./add').bind(api)
  api.find = require('./find').bind(api)
  api.findAll = require('./find-all').bind(api)
  api.findOrAdd = require('./find-or-add').bind(api)
  api.update = require('./update').bind(api)
  api.updateOrAdd = require('./update-or-add').bind(api)
  api.updateAll = require('./update-all').bind(api)
  api.remove = require('./remove').bind(api)

  return api
}
