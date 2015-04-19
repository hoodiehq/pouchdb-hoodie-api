'use strict'

var test = require('tape')
var dbFactory = require('../utils/db')

test('returns hoodie.store-inspired API', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store, 'object', 'is object')
  t.is(store.db, db, 'exposes db')
})

test('constructs a store object w/o new', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store, 'object', 'is object')
  t.is(store.db, db, 'exposes db')
})
