'use strict'

module.exports = withIdPrefix

var EventEmitter = require('events').EventEmitter

/**
 * returns API with all methods except .clear
 *
 * @param  {String}   prefix   String all ID’s are implicitly prefixed or
 *                             expected to be prefixed with.
 * @return {Promise}
 */
function withIdPrefix (state, prefix) {
  var emitter = new EventEmitter()

  var api = {
    add: require('./add').bind(null, state, prefix),
    find: require('./find').bind(null, state, prefix),
    findAll: require('./find-all').bind(null, state, prefix),
    findOrAdd: require('./find-or-add').bind(null, state, prefix),
    update: require('./update').bind(null, state, prefix),
    updateOrAdd: require('./update-or-add').bind(null, state, prefix),
    updateAll: require('./update-all').bind(null, state, prefix),
    remove: require('./remove').bind(null, state, prefix),
    removeAll: require('./remove-all').bind(null, state, prefix),
    withIdPrefix: function (moarPrefix) {
      return withIdPrefix(state, prefix + moarPrefix)
    }
  }

  var prefixState = { api: api, emitter: emitter }

  api.on = require('./on').bind(null, prefixState)
  api.one = require('./one').bind(null, prefixState)
  api.off = require('./off').bind(null, prefixState)

  state.emitter.on('change', function (eventName, object) {
    if (object._id.substr(0, prefix.length) !== prefix) {
      return
    }

    emitter.emit('change', eventName, object)
    emitter.emit(eventName, object)
  })

  return api
}
