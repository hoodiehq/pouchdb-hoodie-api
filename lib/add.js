'use strict'

var toDoc = require('./utils/to-doc')

module.exports = function add (objects) {
  var Promise = this.PouchDB.utils.Promise
  var errors = this.PouchDB.Errors

  if (typeof objects !== 'object') {
    return new Promise(function (resolve, reject) {
      reject(errors.NOT_AN_OBJECT)
    })
  }

  var isArray = Array.isArray(objects)

  if (!isArray) {
    objects = [objects]
  }

  var docs = objects.map(toDoc)

  return this.db.bulkDocs(docs)

  .then(function (responses) {
    if (!isArray && responses[0] instanceof Error) {
      return new Promise(function (resolve, reject) {
        reject(responses[0])
      })
    }

    var output = responses.map(function (res, i) {
      if (res instanceof Error) return res

      objects[i].id = res.id
      objects[i]._rev = res.rev
      return objects[i]
    })

    return isArray ? output : output[0]
  })
}
