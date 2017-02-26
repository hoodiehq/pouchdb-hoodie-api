'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')

test('store.find exists', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.find, 'function', 'has method')
})

test('store.find(id)', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({
    _id: 'foo'
  })

  .then(function () {
    return store.find('foo')
  })

  .then(function (object) {
    t.is(object._id, 'foo', 'resolves value')
  })
})

test('store.find(object)', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({
    _id: 'foo'
  })

  .then(function () {
    return store.find({_id: 'foo'})
  })

  .then(function (object) {
    t.is(object._id, 'foo', 'resolves value')
  })
})

test('store.find fails for non-existing', function (t) {
  t.plan(4)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({
    _id: 'unrelated'
  })

  .then(function () {
    return store.find('foo')
  })

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
    t.is(err.status, 404)
  })

  store.find({_id: 'foo'})

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
    t.is(err.status, 404)
  })
})

test('store.find returns custom not found error for non-existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.find({_id: 'foo'})

  .catch(function (err) {
    t.is(err.name, 'Not found', 'rejects with custom name')
    t.is(err.message, 'Object with id "foo" is missing', 'rejects with custom message')
  })
})

test('store.find(array)', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([
    { _id: 'foo' },
    { _id: 'bar' }
  ])

  .then(function () {
    return store.find(['foo', {_id: 'bar'}])
  })

  .then(function (objects) {
    t.is(objects[0]._id, 'foo', 'resolves value')
    t.is(objects[1]._id, 'bar', 'resolves value')
  })
})

test('store.find(array) with non-existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([
    { _id: 'exists' }
  ])

  .then(function () {
    return store.find(['exists', 'unknown'])
  })

  .then(function (objects) {
    t.is(objects[0]._id, 'exists', 'resolves with value for existing')
    t.is(objects[1].status, 404, 'resolves with 404 error for unknown')
  })
})

test('store.find(array) returns custom not found error for non-existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([
    { _id: 'exists' }
  ])

  .then(function () {
    return store.find(['exists', 'unknown'])
  })

  .then(function (objects) {
    t.is(objects[1].name, 'Not found', 'rejects with custom name for unknown')
    t.is(objects[1].message, 'Object with id "unknown" is missing', 'rejects with custom message for unknown')
  })
})

test('store.find(object) should return timestamps', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({ _id: 'shouldHaveTimestamps' })

  .then(function () {
    return store.update('shouldHaveTimestamps', {foo: 'bar'})
  })

  .then(function () {
    return store.find(['shouldHaveTimestamps'])
  })

  .then(function (objects) {
    t.is(objects[0]._id, 'shouldHaveTimestamps', 'resolves with value for existing')
    t.ok(objects[0].hoodie.createdAt, 'resolves with createdAt timestamp')
    t.ok(objects[0].hoodie.updatedAt, 'resolves with updatedAt timestamp')
  })
})

test('store.find([object]) should return timestamps', function (t) {
  t.plan(6)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([{
    _id: 'shouldHaveTimestamps'
  }, {
    _id: 'shouldAlsoHaveTimestamps'
  }])

  .then(store.update)

  .then(function () {
    return store.find(['shouldHaveTimestamps', 'shouldAlsoHaveTimestamps'])
  })

  .then(function (objects) {
    objects.forEach(function (object) {
      t.ok(object._id, 'resolves with value for existing')
      t.ok(object.hoodie.createdAt, 'resolves with createdAt timestamp')
      t.ok(object.hoodie.updatedAt, 'resolves with updatedAt timestamp')
    })
  })
})
