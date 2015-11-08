'use strict'

module.exports = one

/**
 * adds a one time listener to an event
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
function one (state, eventName, handler) {
  state.emitter.once(eventName, handler)

  return this
}
