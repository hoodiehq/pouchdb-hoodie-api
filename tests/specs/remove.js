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
  t.plan(2)

  var db = dbFactory()
  var store = new Store(db)

  store.add({
    id: 'foo'
  })

  .then(function () {
    return store.remove({id: 'foo'})
  })

  .then(function (object) {
    t.is(object.id, 'foo', 'resolves value')

    return store.find('foo')
  })

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
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
