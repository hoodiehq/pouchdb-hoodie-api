'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')

test('has "clear" method', function (test) {
  test.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  test.is(typeof store.clear, 'function', 'has method')
})

test.skip('removes existing db', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  var localObj1 = {
    _id: 'cleanTest',
    cnt: 'cleanTest dummy doc'
  }
  store.on('clear', function () {
    t.pass("store 'clear' event was triggered")
  })

  store.add(localObj1)

    .then(function () {
      return store.clear()
    })

    .then(function () {
      return db.get('cleanTest')
    })

    .catch(function (error) {
      t.equal(error.status, 404, 'doc removed after store.clear')
    })
})
