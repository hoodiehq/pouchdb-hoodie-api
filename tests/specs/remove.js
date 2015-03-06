'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')
var Store = require('../../')

test('has "remove" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = new Store(db)

  t.is(typeof store.remove, 'function', 'has method')
})

test('removes existing by id', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = new Store(db)

  store.add({
    id: 'foo'
  })

  .then(function () {
    return store.remove('foo')
  })

  .then(function (object) {
    t.is(object.id, 'foo', 'resolves value')

    return store.find('foo')
  })

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
  })
})

test('removes existing by object', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = new Store(db)

  store.add({
    id: 'foo',
    foo: 'bar'
  })

  .then(function () {
    return store.remove({id: 'foo'})
  })

  .then(function (object) {
    t.is(object.id, 'foo', 'resolves value')
    t.is(object.foo, 'bar', 'resolves value')

    return store.find('foo')
  })

  .catch(function (error) {
    t.is(error.status, 404, 'rejects with 404 error')
  })
})

test('fails for non-existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = new Store(db)

  store.remove('foo')

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
  })

  store.remove({id: 'foo'})

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
  })
})

test('store.remove(array) removes existing, returns error for non-existing', function (t) {
  t.plan(7)

  var db = dbFactory()
  var store = new Store(db)

  store.add([
    { id: 'exists1', foo: 'bar' },
    { id: 'exists2', foo: 'baz' }
  ])

  .then(function () {
    return store.remove([
      'exists1',
      { id: 'exists2' },
      'unknown'
    ])
  })

  .then(function (objects) {
    t.is(objects[0].id, 'exists1', 'resolves with value for existing')
    t.is(objects[0].foo, 'bar', 'resolves with value for existing')
    t.is(parseInt(objects[0]._rev, 10), 2, 'resolves with revision 2')
    t.is(objects[1].id, 'exists2', 'resolves with value for existing')
    t.is(objects[1].foo, 'baz', 'resolves with value for existing')
    t.is(parseInt(objects[1]._rev, 10), 2, 'resolves with revision 2')
    t.is(objects[2].status, 404, 'resolves with 404 error for non-existing')
  })
})
