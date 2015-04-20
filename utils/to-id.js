'use strict'

module.exports = function objectsOrIdToId (objectOrId) {
  return typeof objectOrId === 'object' ? objectOrId.id : objectOrId
}
