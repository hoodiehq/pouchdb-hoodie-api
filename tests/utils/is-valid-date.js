'use strict'

module.exports = function isValidDate (date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    return false
  }
  return !isNaN(date.getTime())
}
