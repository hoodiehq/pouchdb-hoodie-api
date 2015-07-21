var toId = require('../utils/to-id')
var addMany = require('./add-many')
var updateMany = require('./update-many')

module.exports = function updateOrAddMany (passedObjects) {
  var self = this
  var addedObjects
  var passedObjectIds = passedObjects.map(toId)

  return addMany.call(this, passedObjects)

  .then(function (_addedObjectsAndErrors) {
    addedObjects = _addedObjectsAndErrors
    var conflicting = passedObjects.reduce(function (array, passedObject, i) {
      var objectOrError = _addedObjectsAndErrors[i]
      var isConflictError = objectOrError instanceof Error && objectOrError.status === 409

      if (isConflictError) {
        array.push(passedObject)
      }
      return array
    }, [])

    return updateMany.call(self, conflicting)
  })

  .then(function (updatedObjects) {
    var objects = []

    updatedObjects.concat(addedObjects).forEach(function (object) {
      var index = passedObjectIds.indexOf(object.id)
      if (index !== -1) {
        objects[index] = object
      }
    })

    return objects
  })
}
