'use strict'

module.exports = withIdPrefix

var EventEmitter = require('events').EventEmitter
var emitter = new EventEmitter()

var eventify = require('./helpers/eventify')

/**
 * returns API with all methods except .clear
 *
 * @param  {String}   prefix   String all ID’s are implicitly prefixed or
 *                             expected to be prefixed with.
 * @return {Promise}
 */
function withIdPrefix (state, prefix) {
  var db = this

  var api = {
    add: eventify(db, state, add.bind(db, prefix)),
    find: find.bind(db, prefix),
    findAll: findAll.bind(db, prefix),
    findOrAdd: findOrAdd.bind(db, state, prefix),
    update: update.bind(db, prefix),
    updateOrAdd: updateOrAdd.bind(db, prefix),
    updateAll: updateAll.bind(db, prefix),
    remove: remove.bind(db, prefix),
    removeAll: removeAll.bind(db, prefix),
    withIdPrefix: function (moarPrefix) {
      return withIdPrefix.call(db, state, prefix + moarPrefix)
    },
    on: function (eventName, handler) {
      emitter.on(eventName, handler)

      return api
    },
    one: function (eventName, handler) {
      emitter.once(eventName, handler)

      return api
    },
    off: function (eventName, handler) {
      emitter.removeListener(eventName, handler)

      return api
    }
  }

  state.emitter.on('change', function (eventName, object) {
    if (object.id.substr(0, prefix.length) !== prefix) {
      return
    }

    emitter.emit('change', eventName, object)
    emitter.emit(eventName, object)
  })

  return api
}

var addOne = require('./helpers/add-one')
var addMany = require('./helpers/add-many')

function add (prefix, objects) {
  return Array.isArray(objects)
    ? addMany.call(this, objects, prefix)
    : addOne.call(this, objects, prefix)
}

var findOne = require('./helpers/find-one')
var findMany = require('./helpers/find-many')

function find (prefix, objectsOrIds) {
  return Array.isArray(objectsOrIds)
    ? findMany.call(this, objectsOrIds, prefix)
    : findOne.call(this, objectsOrIds, prefix)
}

var findOrAddOne = require('./helpers/find-or-add-one')
var findOrAddMany = require('./helpers/find-or-add-many')

function findOrAdd (state, prefix, idOrObjectOrArray, newObject) {
  return Array.isArray(idOrObjectOrArray)
    ? findOrAddMany.call(this, state, idOrObjectOrArray, prefix)
    : findOrAddOne.call(this, state, idOrObjectOrArray, newObject, prefix)
}

var toObject = require('./utils/to-object')

function findAll (prefix, filter) {
  return this.allDocs({
    include_docs: true,
    startkey: prefix,
    endkey: prefix + '\uffff'
  })

  .then(function (res) {
    var objects = res.rows
      .map(function (row) {
        return toObject(row.doc)
      })

    return typeof filter === 'function'
      ? objects.filter(filter)
      : objects
  })
}

var Promise = require('lie')

var updateOne = require('./helpers/update-one')
var updateMany = require('./helpers/update-many')

function update (prefix, objectsOrIds, change) {
  if (typeof objectsOrIds !== 'object' && !change) {
    return Promise.reject(
      new Error('Must provide change')
    )
  }

  return Array.isArray(objectsOrIds)
    ? updateMany.call(this, objectsOrIds, change, prefix)
    : updateOne.call(this, objectsOrIds, change, prefix)
}

var updateOrAddOne = require('./helpers/update-or-add-one')
var updateOrAddMany = require('./helpers/update-or-add-many')

function updateOrAdd (prefix, idOrObjectOrArray, newObject) {
  return Array.isArray(idOrObjectOrArray)
    ? updateOrAddMany.call(this, idOrObjectOrArray, prefix)
    : updateOrAddOne.call(this, idOrObjectOrArray, newObject, prefix)
}

var extend = require('pouchdb-utils').extend

var toDoc = require('./utils/to-doc')
var addTimestamps = require('./utils/add-timestamps')
var isntDesignDoc = require('./utils/isnt-design-doc')

function updateAll (prefix, changedProperties) {
  var type = typeof changedProperties
  var objects

  if (type !== 'object' && type !== 'function') {
    return Promise.reject(new Error('Must provide object or function'))
  }

  return this.allDocs({
    include_docs: true,
    startkey: prefix,
    endkey: prefix + '\uffff'
  })

  .then(function (res) {
    objects = res.rows
      .filter(isntDesignDoc)
      .map(function (row) {
        return toObject(row.doc)
      })

    objects.forEach(addTimestamps)

    if (type === 'function') {
      objects.forEach(changedProperties)
      return objects.map(toDoc)
    }

    return objects.map(function (object) {
      extend(object, changedProperties)
      return toDoc(object)
    })
  })

  .then(function (result) {
    return result
  })
  .then(this.bulkDocs.bind(this))

  .then(function (results) {
    return results.map(function (result, i) {
      objects[i]._rev = result.rev
      return objects[i]
    })
  })
}

var markAsDeleted = require('./utils/mark-as-deleted')

function remove (prefix, objectsOrIds, change) {
  return Array.isArray(objectsOrIds)
    ? updateMany.call(this, objectsOrIds.map(markAsDeleted.bind(null, change)), null, prefix)
    : updateOne.call(this, markAsDeleted(change, objectsOrIds), null, prefix)
}

function removeAll (prefix, filter) {
  var objects

  return this.allDocs({
    include_docs: true,
    startkey: prefix,
    endkey: prefix + '\uffff'
  })

  .then(function (res) {
    objects = res.rows
      .filter(isntDesignDoc)
      .map(function (row) {
        return toObject(row.doc)
      })

    if (typeof filter === 'function') {
      objects = objects.filter(filter)
    }

    return objects.map(function (object) {
      object._deleted = true
      return toDoc(addTimestamps(object))
    })
  })

  .then(this.bulkDocs.bind(this))

  .then(function (results) {
    return results.map(function (result, i) {
      objects[i]._rev = result.rev
      return objects[i]
    })
  })
}
