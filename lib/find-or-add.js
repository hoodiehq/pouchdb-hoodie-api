'use strict'

module.exports = function findOrAdd (id, object) {
  var self = this
  var Promise = this.PouchDB.utils.Promise
  var errors = this.PouchDB.Errors
  var isArray = Array.isArray(id)
  var foundObjects
  var passedObjects

  if (isArray) {
    passedObjects = id
    return self.find(passedObjects)
    .then(function(_foundObjects) {
      var notFoundObjects = []
      foundObjects = _foundObjects
      passedObjects.forEach(function(passedObject) {
        for (var i = 0; i < foundObjects.length; i++) {
          if (passedObject.id === foundObjects[i].id) return
        }
        notFoundObjects.push(passedObject)
      })

      return self.add(notFoundObjects)
    })

    .then(function(addedObjects) {
      var ids = passedObjects.map(function(object) { return object.id })
      var objects = []

      foundObjects.concat(addedObjects).forEach(function(object) {
        var index = ids.indexOf(object.id)
        objects[index] = object
      })
      return objects
    })
  }

  if (typeof id === 'object' ? !id.id : !id) {
    return new Promise(function (resolve, reject) {
      reject(errors.MISSING_ID)
    })
  }

  return self.find(id)

  .catch(function(/*error*/) {
    if (typeof id === 'object') {
      return self.add(id)
    }

    if (typeof object === 'object') {
      object.id = id
    }
    return self.add(object)
  })
}
