module.exports = waitFor

var Promise = require('pouchdb/extras/promise')

function waitFor (check, expected, timeout, interval) {
  return function () {
    if (!timeout) timeout = 1000
    if (!interval) interval = 10

    if (check() === expected) return Promise.resolve()

    return new Promise(function (resolve, reject) {
      var i = setInterval(test, interval)

      function test () {
        timeout -= interval
        if (timeout <= 0) {
          reject(new Error('timeout'))
          clearInterval(i)
          return
        }
        if (check() !== expected) return

        resolve()
        clearInterval(i)
      }
    })
  }
}
