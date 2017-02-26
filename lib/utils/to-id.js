'use strict'

module.exports = function objectOrIdToId (objectOrId) {
  return typeof objectOrId === 'object' ? objectOrId.id : objectOrId
}
