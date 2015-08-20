var toId = require('../utils/to-id')
var findMany = require('./find-many')
var addMany = require('./add-many')
var eventify = require('./eventify')

module.exports = function findOrAddMany (state, passedObjects) {
  var self = this
  var foundObjects
  var passedObjectIds = passedObjects.map(toId)

  return findMany.call(this, passedObjectIds)

  .then(function (_foundObjects) {
    foundObjects = _foundObjects

    var foundObjectIds = foundObjects.map(toId)
    var notFoundObjects = passedObjects.reduce(function (notFoundObjects, passedObject) {
      if (foundObjectIds.indexOf(passedObject.id) === -1) {
        notFoundObjects.push(passedObject)
      }
      return notFoundObjects
    }, [])

    if (state) {
      return eventify(self, state, addMany)(notFoundObjects)
    }

    return addMany.call(self, notFoundObjects)
  })

  .then(function (addedObjects) {
    var objects = []

    foundObjects.concat(addedObjects).forEach(function (object) {
      var index = passedObjectIds.indexOf(object.id)
      objects[index] = object
    })

    return objects
  })
}
