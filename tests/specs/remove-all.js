'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')

test('store.removeAll exists', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.removeAll, 'function', 'has method')
})

test('store.removeAll()', function (t) {
  t.plan(6)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.add([{
    foo: 'foo'
  }, {
    foo: 'foo'
  }, {
    foo: 'foo'
  }])

  .then(function () {
    return store.removeAll()
  })

  .then(function (objects) {
    t.is(objects.length, 3, 'resolves all')
    t.is(objects[0].foo, 'foo', 'resolves with properties')

    objects.forEach(function (object) {
      t.is(parseInt(object._rev, 10), 2, 'new revision')
    })

    return null
  })

  .then(function () {
    return store.findAll()
  })

  .then(function (objects) {
    t.is(objects.length, 0, 'no objects can be found in store')
  })
})

test('store.removeAll(filterFunction)', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([{
    foo: 0
  }, {
    foo: 'foo'
  }, {
    foo: 2
  }, {
    foo: 'bar'
  }, {
    foo: 3
  }, {
    foo: 'baz'
  }, {
    foo: 4
  }])

  .then(function () {
    return store.removeAll(function (object) {
      return typeof object.foo === 'number'
    })
  })

  .then(function (objects) {
    t.is(objects.length, 4, 'removes 4 objects')
  })

  .then(function (objects) {
    return store.findAll()
  })

  .then(function (objects) {
    t.is(objects.length, 3, 'does not remove other 3 objects')
  })
})

test('store.removeAll()', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.add([{
    foo: 'foo'
  }, {
    _id: '_design/bar',
    foo: 'foo'
  }])

  .then(function () {
    return store.removeAll()
  })

  .then(function (objects) {
    t.is(objects.length, 1, 'resolves all')
    t.is(objects[0].foo, 'foo', 'resolves with properties')

    return null
  })

  .then(function () {
    return db.get('_design/bar')
  })

  .then(function (doc) {
    t.is(doc._id, '_design/bar', 'check _design/bar still exists')
  })
})
