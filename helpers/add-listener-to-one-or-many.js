'use strict'

var toObject = require('../utils/to-object')

module.exports = addListenerToOneOrMany

function addListenerToOneOrMany (state, eventName, one, handler) {
  if (!state.pouchDBChangesFeedEmitter) {
    state.pouchDBChangesFeedEmitter = this.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
    .on('create', function (change) {
      var doc = change.doc
      state.emitter.emit('add', toObject(doc))
      state.emitter.emit('change', 'add', toObject(doc))
    })
    .on('update', function (change) {
      var doc = change.doc
      state.emitter.emit('update', toObject(doc))
      state.emitter.emit('change', 'update', toObject(doc))
    })
    .on('delete', function (change) {
      var doc = change.doc
      state.emitter.emit('remove', toObject(doc))
      state.emitter.emit('change', 'remove', toObject(doc))
    })
  }

  if (one) {
    state.emitter.once(eventName, handler)
  } else {
    state.emitter.on(eventName, handler)
  }
}
