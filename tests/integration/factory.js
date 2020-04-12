'use strict'

var test = require('tape')
var dbFactory = require('../utils/db')
var EventEmitter = require('events').EventEmitter

test('returns hoodie.store-inspired API', function (t) {
  t.plan(3)

  var db = dbFactory()

  t.is(typeof db.hoodieApi, 'function', 'exposes plugin initialisation method')

  var store = db.hoodieApi()

  t.is(typeof store, 'object', 'is object')
  t.is(store.db, db, 'exposes db')
})

test('creates store with custom EventEmitter instance', function (t) {
  t.plan(1)

  var db = dbFactory()
  var emitter = new EventEmitter()
  var store = db.hoodieApi({ emitter: emitter })

  store.on('foo', function () {
    t.ok('emitter used from options')
  })
  emitter.emit('foo')
})
