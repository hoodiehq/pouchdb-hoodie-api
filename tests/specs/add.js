'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')
var Store = require('../../')

test('has "add" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = new Store(db)

  t.is(typeof store.add, 'function', 'has method')
})

test('adds object to db', function (t) {
  t.plan(5)

  var db = dbFactory()
  var store = new Store(db)

  store.add({
    foo: 'bar'
  })

  .then(function (object) {
    t.is(object.foo, 'bar', 'resolves value')
    t.is(typeof object.id, 'string', 'resolves id')
    t.is(typeof object._rev, 'string', 'resolves _rev')

    return db.allDocs({
      include_docs: true
    })
  })

  .then(function (res) {
    t.is(res.total_rows, 1, 'puts doc')
    t.is(res.rows[0].doc.foo, 'bar', 'puts value')
  })
})

test('adds object with id to db', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = new Store(db)

  store.add({
    id: 'baz',
    foo: 'bar'
  })

 .then(function (object) {
    t.is(object.id, 'baz', 'resolves id')
    return db.get('baz')
  })

  .then(function (doc) {
    t.is(doc.foo, 'bar')
  })
})

test('fails for invalid object', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = new Store(db)

  store.add()

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
    t.is(err.status, 400, 'rejects with error 400')
  })
})

test('fails for existing object', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = new Store(db)

  store.add({id: 'foo', foo: 'bar'})

  .then(function() {
    return store.add({id: 'foo', foo: 'baz'})
  })

  .catch(function (err) {
    t.ok(err instanceof Error, 'rejects error')
    t.is(err.status, 409, 'rejects status')
  })
})

test('adds multiple objects to db', function (t) {
  t.plan(8)

  var db = dbFactory()
  var store = new Store(db)

  store.add({
    id: 'foo',
    foo: 'bar'
  })

  .then(function () {
    return store.add([{
      foo: 'bar'
    }, {
      foo: 'baz'
    }, {
      id: 'foo',
      foo: 'baz'
    }])
  })

  .then(function (objects) {
    t.is(objects[0].foo, 'bar', 'resolves first value')
    t.ok(objects[0].id, 'resolves first id')
    t.ok(objects[0]._rev, 'resolves first _rev')

    t.is(objects[1].foo, 'baz', 'resolves second value')
    t.ok(objects[1].id, 'resolves second id')
    t.ok(objects[1]._rev, 'resolves second _rev')

    t.ok(objects[2] instanceof Error, 'resolves third w/ error')

    return db.allDocs()
  })

  .then(function (res) {
    t.is(res.total_rows, 3, 'puts docs')
  })
})
