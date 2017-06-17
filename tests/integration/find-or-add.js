'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')

test('store.findOrAdd exists', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.findOrAdd, 'function', 'has method')
})

test('store.findOrAdd(id, object) finds existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({_id: 'exists', foo: 'bar'})

  .then(function () {
    return store.findOrAdd('exists', {foo: 'baz'})
  })

  .then(function (object) {
    t.is(object._id, 'exists', 'resolves with id')
    t.is(object.foo, 'bar', 'resolves with old object')
  })
})
test('store.findOrAdd(id, object) adds new', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.findOrAdd('newid', {foo: 'baz'})

  .then(function (object) {
    t.is(object._id, 'newid', 'resolves with id')
    t.is(object.foo, 'baz', 'resolves with new object')
  })
})

test('store.findOrAdd(id) fails if no object exists', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.findOrAdd('thing')
  .catch(function (error) {
    t.is(error.status, 412, 'rejects with 412 error')
  })
})

test('store.findOrAdd(object) finds existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({_id: 'exists', foo: 'bar'})

  .then(function (object) {
    return store.findOrAdd({_id: 'exists', foo: 'baz'})
  })

  .then(function (object) {
    t.is(object._id, 'exists', 'resolves with id')
    t.is(object.foo, 'bar', 'resolves with old object')
  })
})

test('store.findOrAdd(object) adds new', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.findOrAdd({_id: 'newid', foo: 'baz'})

  .then(function (object) {
    t.is(object._id, 'newid', 'resolves with id')
    t.is(object.foo, 'baz', 'resolves with new object')
  })
})

test('store.findOrAdd(object) fails if object has no id', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.findOrAdd({foo: 'bar'})

  .catch(function (error) {
    t.is(error.status, 412)
  })
})

test('store.findOrAdd([object1, object2])', function (t) {
  t.plan(4)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([
    {_id: 'exists'}
  ]).then(function () {
    return store.findOrAdd([
      {_id: 'exists', foo: 'bar'},
      {_id: 'unknown', foo: 'baz'}
    ])
    .then(function (objects) {
      t.is(objects[0]._id, 'exists', 'object1 to be found')
      t.is(objects[0].foo, undefined, 'object1 to be found')
      t.is(objects[1]._id, 'unknown', 'object2 to be created')
      t.is(objects[1].foo, 'baz', 'object2 to be created')
    })
  })
})

test('#58 store.findOrAdd(id, object) triggers no events when finds existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.on('add', function () {
    t.pass('add event')
  })

  store.add({_id: 'exists', foo: 'bar'})

  .then(function () {
    return store.findOrAdd('exists', {foo: 'baz'})
  })

  .then(function () {
    return store.findOrAdd('doesntExist', {foo: 'baz'})
  })
})

test('#58 store.findOrAdd([object1, object2]) triggers no events when finds existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.on('add', function () {
    t.pass('add event')
  })

  store.add({_id: 'exists', foo: 'bar'})

  .then(function () {
    return store.findOrAdd([
      {_id: 'exists', foo: 'bar'}
    ])
  })

  .then(function () {
    return store.findOrAdd([
      {_id: 'unknown', foo: 'baz'}
    ])
  })
})
