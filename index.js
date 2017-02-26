'use strict'

var exports = module.exports = { hoodieApi: hoodieApi }

var EventEmitter = require('events').EventEmitter
var startListenToChanges = require('./helpers/start-listen-to-changes')

function hoodieApi (options) {
  var state = {
    emitter: options && options.emitter || new EventEmitter()
  }

  state.emitter.once('newListener', startListenToChanges.bind(this, state))

  return {
    db: this,
    add: require('./add').bind(this, null),
    find: require('./find').bind(this, null),
    findAll: require('./find-all').bind(this, null),
    findOrAdd: require('./find-or-add').bind(this, state, null),
    update: require('./update').bind(this, null),
    updateOrAdd: require('./update-or-add').bind(this, null),
    updateAll: require('./update-all').bind(this, null),
    remove: require('./remove').bind(this, null),
    removeAll: require('./remove-all').bind(this, null),
    withIdPrefix: require('./with-id-prefix').bind(this, state),
    on: require('./lib/on').bind(this, state),
    one: require('./lib/one').bind(this, state),
    off: require('./lib/off').bind(this, state),
    clear: require('./clear').bind(this, state)
  }
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports)
}
