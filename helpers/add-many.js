'use strict'

var toDoc = require('../utils/to-doc')
var addTimestamps = require('../utils/add-timestamps')

module.exports = function addMany (objects) {
  objects.forEach(addTimestamps)
  return this.bulkDocs(objects.map(toDoc))

  .then(function (responses) {
    return responses.map(function (response, i) {
      if (response instanceof Error) {
        return response
      }

      objects[i].id = response.id
      objects[i]._rev = response.rev
      return objects[i]
    })
  })
}
