'use strict'

var test = require('tape')
var lolex = require('lolex')

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
    t.is(objects.length, 1, 'resolves everything but _design/bar')
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

test.skip('store.removeAll(changedProperties) updates before removing', function (t) {
  t.plan(7)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.add([{
    foo: 'foo'
  }, {
    foo: 'bar'
  }, {
    foo: 'baz'
  }])

  .then(function () {
    return store.removeAll({
      foo: 'changed'
    })
  })

  .then(function (results) {
    t.is(results.length, 3, 'resolves all')
    results.forEach(function (result) {
      t.ok(result.id, 'resolves with id')
      t.is(result.foo, 'changed', 'check all results have changed')
    })
  })
})

test.skip('store.removeAll(updateFunction) updates before removing', function (t) {
  t.plan(7)

  var db = dbFactory()
  var store = db.hoodieApi()

  return store.add([{
    foo: 'foo'
  }, {
    foo: 'bar'
  }, {
    foo: 'baz'
  }])

  .then(function () {
    return store.removeAll(function (object) {
      object.foo = 'changed'
      return object
    })
  })

  .then(function (results) {
    t.is(results.length, 3, 'resolves all')
    results.forEach(function (result) {
      t.ok(result.id, 'resolves with id')
      t.is(result.foo, 'changed', 'check all results have changed')
    })
  })
})

test('store.removeAll([objects]) creates deletedAt timestamps', function (t) {
  t.plan(12)

  var clock = lolex.install(0, ['Date'])
  var db = dbFactory()
  var store = db.hoodieApi()

  var now = require('../../lib/utils/now')
  var isValidDate = require('../utils/is-valid-date')

  store.add([{
    id: 'shouldHaveTimestamps'
  }, {
    id: 'shouldAlsoHaveTimestamps'
  }])

  .then(store.removeAll.bind(store))

  .then(function (objects) {
    objects.forEach(function (object) {
      t.ok(object.id, 'resolves doc')
      t.ok(object.createdAt, 'should have createdAt timestamp')
      t.ok(object.updatedAt, 'should have updatedAt timestamp')
      t.ok(object.deletedAt, 'should have deleteAt timestamp')
      t.ok(isValidDate(object.deletedAt), 'createdAt should be a valid date')
      t.is(now(), object.deletedAt, 'createdAt should be the same time as right now')
    })

    clock.uninstall()
  })
})
