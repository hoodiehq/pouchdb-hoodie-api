'use strict'

module.exports = off

/**
 * removes a listener for the specified event
 *
 * It will unsubscribe at most, one instance of a listener for a particular event.
 * If any single listener has subcribed multiple times to the same event,
 * then `off` must be called multiple times.
 *
 * Supported events:
 *
 * - `add`
 * - `update`
 * - `remove`
 * - `change`
 *
 * @param  {String} eventName   Name of event, one of listed above
 * @param  {Function} handler   callback for event
 */
function off (state, eventName, handler) {
  state.emitter.removeListener(eventName, handler)

  return this
}
