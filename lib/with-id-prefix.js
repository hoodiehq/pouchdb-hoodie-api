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
  var db = this
  var emitter = new EventEmitter()

  var api = {
    add: require('./add').bind(this, prefix),
    find: require('./find').bind(this, prefix),
    findAll: require('./find-all').bind(this, prefix),
    findOrAdd: require('./find-or-add').bind(this, state, prefix),
    update: require('./update').bind(this, prefix),
    updateOrAdd: require('./update-or-add').bind(this, prefix),
    updateAll: require('./update-all').bind(this, prefix),
    remove: require('./remove').bind(this, prefix),
    removeAll: require('./remove-all').bind(this, prefix),
    withIdPrefix: function (moarPrefix) {
      return withIdPrefix.call(db, state, prefix + moarPrefix)
    },
    on: require('./on').bind(this, {emitter: emitter}),
    one: require('./one').bind(this, {emitter: emitter}),
    off: require('./off').bind(this, {emitter: emitter})
  }

  state.emitter.on('change', function (eventName, object) {
    if (object.id.substr(0, prefix.length) !== prefix) {
      return
    }

    emitter.emit('change', eventName, object)
    emitter.emit(eventName, object)
  })

  return api
}
