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
    id: 'foo'
  })

  .then(function () {
    return store.find('foo')
  })

  .then(function (object) {
    t.is(object.id, 'foo', 'resolves value')
  })
})

test('store.find(object)', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({
    id: 'foo'
  })

  .then(function () {
    return store.find({id: 'foo'})
  })

  .then(function (object) {
    t.is(object.id, 'foo', 'resolves value')
  })
})

test('store.find fails for non-existing', function (t) {
  t.plan(4)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({
    id: 'unrelated'
  })

  .then(function () {
    return store.find('foo')
  })

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
    t.is(err.status, 404)
  })

  store.find({id: 'foo'})

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
    t.is(err.status, 404)
  })
})

test('store.find(array)', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([
    { id: 'foo' },
    { id: 'bar' }
  ])

  .then(function () {
    return store.find(['foo', {id: 'bar'}])
  })

  .then(function (objects) {
    t.is(objects[0].id, 'foo', 'resolves value')
    t.is(objects[1].id, 'bar', 'resolves value')
  })
})

test('store.find(array) with non-existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([
    { id: 'exists' }
  ])

  .then(function () {
    return store.find(['exists', 'unknown'])
  })

  .then(function (objects) {
    t.is(objects[0].id, 'exists', 'resolves with value for existing')
    t.is(objects[1].status, 404, 'resolves with 404 error for unknown')
  })
})

test('store.find(object) should return timestamps', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({ id: 'shouldHaveTimestamps' })

  .then(function () {
    return store.find(['shouldHaveTimestamps'])
  })

  .then(function (objects) {
    t.is(objects[0].id, 'shouldHaveTimestamps', 'resolves with value for existing')
    t.ok(objects[0].createdAt, 'resolves with createdAt timestamp')
    t.ok(objects[0].updatedAt, 'resolves with updatedAt timestamp')
  })
})

test('store.find([object]) should return timestamps', function (t) {
  t.plan(6)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([{
    id: 'shouldHaveTimestamps'
  }, {
    id: 'shouldAlsoHaveTimestamps'
  }])

  .then(function () {
    return store.find(['shouldHaveTimestamps', 'shouldAlsoHaveTimestamps'])
  })

  .then(function (objects) {
    objects.forEach(function (object) {
      t.ok(object.id, 'resolves with value for existing')
      t.ok(object.createdAt, 'resolves with createdAt timestamp')
      t.ok(object.updatedAt, 'resolves with updatedAt timestamp')
    })
  })
})
