'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')

test('store.updateOrAdd exists', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.updateOrAdd, 'function', 'has method')
})

test('store.updateOrAdd(id, object) updates existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({id: 'exists', foo: 'bar'})

  .then(function () {
    return store.updateOrAdd('exists', {foo: 'baz'})
  })

  .then(function (object) {
    t.is(object.id, 'exists', 'resolves with id')
    t.is(object.foo, 'baz', 'resolves with new object')
  })
})

test('store.updateOrAdd(id, object) adds new if non-existent', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.updateOrAdd('newid', {foo: 'baz'})

  .then(function (object) {
    t.is(object.id, 'newid', 'resolves with id')
    t.is(object.foo, 'baz', 'resolves with new object')
  })
})

test('store.updateOrAdd(id) fails with 400 error', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.updateOrAdd('id')

  .catch(function (error) {
    t.is(error.status, 400, 'rejects with invalid request error')
  })
})

test('store.updateOrAdd(object) updates existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({id: 'exists', foo: 'bar'})

  .then(function () {
    return store.updateOrAdd({id: 'exists', foo: 'baz'})
  })

  .then(function (object) {
    t.is(object.id, 'exists', 'resolves with id')
    t.is(object.foo, 'baz', 'resolves with new object')
  })
})

test('store.updateOrAdd(object) adds new if non-existent', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.updateOrAdd({id: 'newid', foo: 'baz'})

  .then(function (object) {
    t.is(object.id, 'newid', 'resolves with id')
    t.is(object.foo, 'baz', 'resolves with new object')
  })
})

test('store.updateOrAdd(object) without object.id fails with 400 error', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.updateOrAdd({foo: 'bar'})

  .catch(function (error) {
    t.is(error.status, 400, 'rejects with invalid request error')
  })
})

test('store.updateOrAdd(array) updates existing, adds new', function (t) {
  t.plan(5)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add([
    {id: 'exists', foo: 'bar'}
  ]).then(function () {
    return store.updateOrAdd([
      {id: 'exists', foo: 'baz'},
      {id: 'unknown', foo: 'baz'}
    ])
    .then(function (objects) {
      t.is(objects[0].id, 'exists', 'object1 to be updated')
      t.is(objects[0].foo, 'baz', 'object1 to be updated')
      t.is(parseInt(objects[0]._rev, 10), 2, 'object1 has revision 2')
      t.is(objects[1].id, 'unknown', 'object2 to be created')
      t.is(objects[1].foo, 'baz', 'object2 to be created')
    })
  })
})
