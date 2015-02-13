'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')
var Store = require('../../')

test('store.update() exists', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = new Store(db)

  t.is(typeof store.update, 'function', 'has method')
})

test('store.update(id, changedProperties)', function(t) {
  t.plan(3)

  var db = dbFactory()
  var store = new Store(db)

  store.add({
    id: 'exists',
    foo: 'bar'
  })

  .then(function () {
    return store.update('exists', {
      foo: 'baz'
    })
  })

  .then(function (object) {
    t.ok(object.id)
    t.ok(/^2\-/.test(object._rev), 'revision is 2')
    t.is(object.foo, 'baz', 'passes properties')
  })
})

test('store.update(id)', function(t) {
  t.plan(1)

  var db = dbFactory()
  var store = new Store(db)

  store.update('nothinghere')

  .catch(function(error) {
    t.ok(error instanceof Error, 'rejects error')
  })
})

test('store.update("unknown", changedProperties)', function(t) {
  t.plan(1)

  var db = dbFactory()
  var store = new Store(db)

  store.update('unknown', {foo: 'bar'})

  .catch(function(error) {
    t.ok(error instanceof Error, 'rejects error')
  })
})

test('hoodie.store.update(id, updateFunction)', function(t) {
  t.plan(3)

  var db = dbFactory()
  var store = new Store(db)

  store.add({ id: 'exists' })

  .then(function() {
    return store.update('exists', function(object) {
      object.foo = object.id + 'bar'
    })
  })

  .then(function(object) {
    t.ok(object.id)
    t.ok(/^2-/.test(object._rev))
    t.is(object.foo, 'existsbar', 'resolves properties')
  })
})

test('hoodie.store.update(object)', function(t) {
  t.plan(3)

  var db = dbFactory()
  var store = new Store(db)

  store.add({ id: 'exists' })

  .then(function() {
    return store.update({
      id: 'exists',
      foo: 'bar'
    })
  })

  .then(function(object) {
    t.ok(object.id, 'resolves with id')
    t.ok(/^2-/.test(object._rev), 'resolves with new rev number')
    t.is(object.foo, 'bar', 'resolves with properties')
  })
})
