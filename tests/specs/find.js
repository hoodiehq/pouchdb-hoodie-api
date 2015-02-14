'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')
var Store = require('../../')

test('store.find exists', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = new Store(db)

  t.is(typeof store.find, 'function', 'has method')
})

test('store.find(id)', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = new Store(db)

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
  var store = new Store(db)

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

test('store.find(array)', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = new Store(db)

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

test('store.find fails for non-existing', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = new Store(db)

  store.find('foo')

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
  })

  store.find({id: 'foo'})

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
  })
})
