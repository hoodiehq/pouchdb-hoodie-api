'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')

test('has "updateAll" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.updateAll, 'function', 'has method')
})

test('store.updateAll(changedProperties)', function (t) {
  t.plan(12)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.add([{
    foo: 'foo',
    bar: 'foo'
  }, {
    foo: 'bar'
  }, {
    foo: 'baz'
  }])

  .then(function () {
    return store.updateAll({
      bar: 'bar'
    })
  })

  .then(function (results) {
    t.is(results.length, 3, 'resolves all')
    t.ok(results[0].id, 'resolves with id')
    t.is(results[0].bar, 'bar', 'resolves with properties')

    results.forEach(function (result) {
      t.ok(/^2-/.test(result._rev), 'new revision')
    })

    return null
  })

  .then(store.findAll)

  .then(function (objects) {
    objects.forEach(function (object) {
      t.ok(object.foo, 'old value remains')
      t.is(object.bar, 'bar', 'updated object')
    })
  })
})

test('store.updateAll(updateFunction)', function (t) {
  t.plan(10)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.add([{
    foo: 'foo',
    bar: 'foo'
  }, {
    foo: 'bar'
  }, {
    foo: 'baz'
  }])

  .then(function () {
    return store.updateAll(function (object) {
      object.bar = 'bar'
      return object
    })
  })

  .then(function (results) {
    t.is(results.length, 3, 'resolves all')

    results.forEach(function (result) {
      t.ok(/^2-/.test(result._rev), 'new revision')
    })

    return null
  })

  .then(store.findAll)

  .then(function (objects) {
    objects.forEach(function (object) {
      t.ok(object.foo, 'old value remains')
      t.is(object.bar, 'bar', 'updated object')
    })
  })
})

test('fails store.updateAll()', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.updateAll()

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
  })
})

test('store.updateAll(change) no objects', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.updateAll({})

  .then(function (results) {
    t.same(results, [], 'reolves empty array')
  })
})
