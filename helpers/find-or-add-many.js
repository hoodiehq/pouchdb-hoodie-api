var toId = require('../utils/to-id')
var findMany = require('./find-many')
var addMany = require('./add-many')
var eventify = require('./eventify')

module.exports = function findOrAddMany (state, passedObjects, prefix) {
  var self = this
  var foundObjects
  var passedObjectIds = passedObjects.map(toId)

  if (prefix) {
    passedObjectIds = passedObjectIds.map(function (id) {
      return prefix + id
    })
  }

  return findMany.call(this, passedObjectIds, prefix)

  .then(function (_foundObjects) {
    foundObjects = _foundObjects

    var foundObjectIds = foundObjects.map(toId)
    var notFoundObjects = passedObjects.reduce(function (notFoundObjects, passedObject) {
      if (foundObjectIds.indexOf((prefix || '') + passedObject.id) === -1) {
        notFoundObjects.push(passedObject)
      }
      return notFoundObjects
    }, [])

    if (state) {
      return eventify(self, state, function (objects) {
        return addMany.call(self, objects, prefix)
      })(notFoundObjects)
    }

    return addMany.call(self, notFoundObjects, prefix)
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
