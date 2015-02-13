'use strict'

var test = require('tape')

var sum = require('../../')

test('adds up two arguments', function (t) {
  t.plan(3)

  t.is(sum(1, 1), 2)
  t.is(sum(2, 2), 4)
  t.is(sum(10, 2), 12)
})
