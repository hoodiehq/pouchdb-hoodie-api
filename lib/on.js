'use strict'

module.exports = on

/**
 * add a listener to an event
 *
 * Supported events:
 *
 * - `add`    → (object, options)
 * - `update` → (object, options)
 * - `remove` → (object, options)
 * - `change` → (eventName, object, options)
 *
 * @param  {String} eventName   Name of event, one of listed above
 * @param  {Function} handler   callback for event
 */
function on (state, eventName, handler) {
  state.emitter.on(eventName, handler)

  return this
}
