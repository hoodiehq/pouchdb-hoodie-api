module.exports = eventify

/**
 * runs a method from the API and triggers events on each object.
 *
 * Note that we didn't implement this pased on PouchDB's .changes()
 * API on purpose, because of
 *
 * 1. the timeing the events would get triggered.
 *    See https://github.com/hoodiehq/pouchdb-hoodie-api/issues/54
 * 2. PouchDB’s .changes() events do not distinguish between local and remote
 *    changes, and for Hoodie we need this distinguishing.
 **/
function eventify (db, state, method, eventName) {
  return function () {
    return method.apply(db, arguments).then(function (result) {
      if (Array.isArray(result)) {
        result.forEach(triggerEvent.bind(null, state, eventName))
      } else {
        triggerEvent(state, eventName, result)
      }

      return result
    })
  }
}

function triggerEvent (state, eventName, object) {
  if (!eventName) {
    eventName = parseInt(object._rev, 10) > 1 ? 'update' : 'add'
  }

  state.emitter.emit(eventName, object)
  state.emitter.emit('change', eventName, object)
}
