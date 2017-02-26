'use strict'

module.exports = clear

/**
 * destroys db
 */
function clear (state) {
  return state.db.destroy()
    .then(function () {
      state.emitter.emit('clear')
    })
}
