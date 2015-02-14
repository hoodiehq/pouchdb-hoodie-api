'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')
var Store = require('../../')

test('store.findAll exists', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = new Store(db)

  t.is(typeof store.findAll, 'function', 'has method')
})

test('store.findAll()', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = new Store(db)

  store.findAll()

  .then(function (objects) {
    t.same(objects, [], 'resolves empty array')

    return store.add([{foo: 'bar'}, {foo: 'baz'}])
  })

  .then(store.findAll)

  .then(function (objects) {
    t.is(objects.length, 2, 'resolves all')

    return store.remove(objects[0])
  })

  .then(store.findAll)

  .then(function (objects) {
    t.is(objects.length, 1, 'resolves all')
  })
})

test('store.findAll(filterFunction)', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = new Store(db)

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
    return store.findAll(function (object) {
      return typeof object.foo === 'number'
    })
  })

  .then(function (objects) {
    t.is(objects.length, 4, 'resolves filtered')
  })
})
