'use strict'

module.exports = clear

/**
 * destroys db
 */
function clear (state) {
  var db = this

  return db.destroy()
    .then(function () {
      state.emitter.emit('clear')
    })
}
