'use strict'

var exports = module.exports = { hoodieApi: hoodieApi }

var EventEmitter = require('events').EventEmitter
var startListenToChanges = require('./lib/helpers/start-listen-to-changes')

function hoodieApi (options) {
  var state = {
    emitter: (options && options.emitter) || new EventEmitter(),
    db: this
  }

  state.emitter.once('newListener', startListenToChanges.bind(null, state))

  var api = {
    db: state.db,
    add: require('./lib/add').bind(null, state, null),
    find: require('./lib/find').bind(null, state, null),
    findAll: require('./lib/find-all').bind(null, state, null),
    findOrAdd: require('./lib/find-or-add').bind(null, state, null),
    update: require('./lib/update').bind(null, state, null),
    updateOrAdd: require('./lib/update-or-add').bind(null, state, null),
    updateAll: require('./lib/update-all').bind(null, state, null),
    remove: require('./lib/remove').bind(null, state, null),
    removeAll: require('./lib/remove-all').bind(null, state, null),
    withIdPrefix: require('./lib/with-id-prefix').bind(null, state),
    on: require('./lib/on').bind(null, state),
    one: require('./lib/one').bind(null, state),
    off: require('./lib/off').bind(null, state),
    clear: require('./lib/clear').bind(null, state)
  }

  state.api = api

  return api
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports)
}
