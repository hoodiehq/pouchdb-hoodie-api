'use strict'

var exports = module.exports = { hoodieApi: hoodieApi }

var EventEmitter = require('events').EventEmitter

var eventify = require('./helpers/eventify')

function hoodieApi (options) {
  var state = {
    emitter: options && options.emitter || new EventEmitter()
  }

  return {
    db: this,
    add: eventify(this, state, require('./add')),
    find: require('./find').bind(this),
    findAll: require('./find-all').bind(this),
    findOrAdd: require('./lib/find-or-add-with-events').bind(this, state),
    update: eventify(this, state, require('./update')),
    updateOrAdd: eventify(this, state, require('./update-or-add')),
    updateAll: eventify(this, state, require('./update-all')),
    remove: eventify(this, state, require('./remove'), 'remove'),
    removeAll: eventify(this, state, require('./remove-all'), 'remove'),
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
