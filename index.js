'use strict'

var exports = module.exports = { hoodieApi: hoodieApi }

var EventEmitter = require('events').EventEmitter
var startListenToChanges = require('./lib/helpers/start-listen-to-changes')

function hoodieApi (options) {
  var state = {
    emitter: options && options.emitter || new EventEmitter()
  }

  state.emitter.once('newListener', startListenToChanges.bind(this, state))

  return {
    db: this,
    add: require('./lib/add').bind(this, null),
    find: require('./lib/find').bind(this, null),
    findAll: require('./lib/find-all').bind(this, null),
    findOrAdd: require('./lib/find-or-add').bind(this, state, null),
    update: require('./lib/update').bind(this, null),
    updateOrAdd: require('./lib/update-or-add').bind(this, null),
    updateAll: require('./lib/update-all').bind(this, null),
    remove: require('./lib/remove').bind(this, null),
    removeAll: require('./lib/remove-all').bind(this, null),
    withIdPrefix: require('./lib/with-id-prefix').bind(this, state),
    on: require('./lib/on').bind(this, state),
    one: require('./lib/one').bind(this, state),
    off: require('./lib/off').bind(this, state),
    clear: require('./lib/clear').bind(this, state)
  }
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports)
}
