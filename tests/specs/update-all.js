'use strict'

var test = require('tape')
var lolex = require('lolex')

var dbFactory = require('../utils/db')

test('has "updateAll" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.updateAll, 'function', 'has method')
})

test('store.updateAll(changedProperties)', function (t) {
  t.plan(13)

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
      bar: 'bar',
      hoodie: {ignore: 'me'}
    })
  })

  .then(function (results) {
    t.is(results.length, 3, 'resolves all')
    t.ok(results[0]._id, 'resolves with id')
    t.is(results[0].bar, 'bar', 'resolves with properties')
    t.is(results[0].hoodie.ignore, undefined, 'ignores hoodie property')

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

test('store.updateAll() doesnt update design docs', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.add([{
    bar: 'foo'
  }, {
    _id: '_design/bar',
    bar: 'foo'
  }])

  .then(function () {
    return store.updateAll({
      bar: 'bar'
    })
  })

  .then(function (results) {
    t.is(results.length, 1, 'resolves everything but _design/bar')
    t.isNot(results[0]._id, '_design/bar', 'resolves with id')

    return null
  })

  .then(function () {
    return db.get('_design/bar')
  })

  .then(function (doc) {
    t.isNot(doc.bar, 'bar', 'check _design/bar for mutation')
  })
})

test('store.updateAll([objects]) updates all updatedAt timestamps', function (t) {
  t.plan(8)

  var clock = lolex.install(0, ['Date'])
  var db = dbFactory()
  var store = db.hoodieApi()

  var now = require('../../lib/utils/now')
  var isValidDate = require('../utils/is-valid-date')

  var updatedCount = 0
  var objectsToAdd = [{
    _id: 'shouldHaveTimestamps'
  }, {
    _id: 'shouldAlsoHaveTimestamps'
  }]

  store.add(objectsToAdd)

  .then(function () {
    clock.tick(100)

    store.updateAll({ foo: 'bar' })
  })

  store.on('update', function (object) {
    t.ok(object._id, 'resolves doc')
    t.ok(isValidDate(object.hoodie.updatedAt), 'updatedAt should be a valid date')
    t.is(now(), object.hoodie.updatedAt, 'updatedAt should be the same time as right now')
    t.not(object.hoodie.createdAt, object.hoodie.updatedAt, 'createdAt and updatedAt should not be the same')

    if (++updatedCount === objectsToAdd.length) {
      clock.uninstall()
    }
  })
})
