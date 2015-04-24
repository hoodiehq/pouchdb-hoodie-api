'use strict'

var test = require('tape')
var dbFactory = require('../utils/db')
var waitFor = require('../utils/wait-for')

test('has "on" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.on, 'function', 'has method')
})

test('has "one" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.one, 'function', 'has method')
})

test('has "off" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.off, 'function', 'has method')
})

test('store.on("add") with adding one', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()
  var addEvents = []

  store.on('add', addEventToArray.bind(null, addEvents))

  store.add({
    foo: 'bar'
  })

  .then(waitFor(function () {
    return addEvents.length
  }, 1))

  .then(function () {
    t.is(addEvents.length, 1, 'triggers 1 add event')
    t.is(addEvents[0].object.foo, 'bar', 'event passes object')
  })
})

test('store.on("add") with adding two', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var addEvents = []

  store.on('add', addEventToArray.bind(null, addEvents))

  store.add([
    {foo: 'bar'},
    {foo: 'baz'}
  ])

  .then(waitFor(function () {
    return addEvents.length
  }, 2))

  .then(function () {
    var orderedObjAttrs = [
      addEvents[0].object.foo,
      addEvents[1].object.foo
    ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 add event')
    t.is(orderedObjAttrs[0], 'bar', '1st event passes object')
    t.is(orderedObjAttrs[1], 'baz', '2nd event passes object')
  })
})

test('store.on("add") with one element added before registering event and one after', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()
  var addEvents = []

  store.add({
    foo: 'bar'
  })

  .then(function () {
    store.on('add', addEventToArray.bind(null, addEvents))

    return store.add({
      foo: 'baz'
    })
  })

  .then(waitFor(function () {
    return addEvents.length
  }, 1))

  .then(function () {
    t.is(addEvents.length, 1, 'triggers only 1 add event')
    t.is(addEvents[0].object.foo, 'baz', 'event passes object')
  })
})

test('store.on("add") with add & update', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()
  var addEvents = []

  store.on('add', addEventToArray.bind(null, addEvents))

  store.updateOrAdd({
    id: 'test',
    nr: 1
  })

  .then(function () {
    return store.updateOrAdd('test', {nr: 2})
  })

  .then(waitFor(function () {
    return addEvents.length
  }, 1))

  .then(function () {
    t.is(addEvents.length, 1, 'triggers 1 add event')
    t.is(addEvents[0].object.nr, 1, 'event passes object')
  })
})

test('store.on("update") with updating one', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()
  var updateEvents = []

  store.on('update', addEventToArray.bind(null, updateEvents))

  store.add({
    id: 'test'
  })

  .then(function (obj) {
    return store.update({
      id: 'test',
      foo: 'bar'
    })
  })

  .then(waitFor(function () {
    return updateEvents.length
  }, 1))

  .then(function () {
    t.is(updateEvents.length, 1, 'triggers 1 update event')
    t.is(updateEvents[0].object.foo, 'bar', 'event passes object')
  })
})

test('store.on("update") with updating two', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var updateEvents = []

  store.on('update', addEventToArray.bind(null, updateEvents))

  store.add([
    {id: 'first'},
    {id: 'second'}
  ])

  .then(function (obj) {
    return store.update([
      { id: 'first', foo: 'bar'},
      { id: 'second', foo: 'baz'}
    ])
  })

  .then(waitFor(function () {
    return updateEvents.length
  }, 2))

  .then(function () {
    var orderedObjAttrs = [
      updateEvents[0].object.foo,
      updateEvents[1].object.foo
    ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 update event')
    t.is(orderedObjAttrs[0], 'bar', '1st event passes object')
    t.is(orderedObjAttrs[1], 'baz', '2nd event passes object')
  })
})

test('store.on("update") with add & update', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()
  var updateEvents = []

  store.on('update', addEventToArray.bind(null, updateEvents))

  store.updateOrAdd({
    id: 'test',
    nr: 1
  })

  .then(function () {
    return store.updateOrAdd('test', {nr: 2})
  })

  .then(waitFor(function () {
    return updateEvents.length
  }, 1))

  .then(function () {
    t.is(updateEvents.length, 1, 'triggers 1 update event')
    t.is(updateEvents[0].object.nr, 2, 'event passes object')
  })
})

test('store.on("update") with update all', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var updateEvents = []

  store.on('update', addEventToArray.bind(null, updateEvents))

  store.add([
    {id: 'first', foo: '1'},
    {id: 'second', foo: '2'}
  ])

  .then(function () {
    return store.updateAll({
      bar: 'baz'
    })
  })

  .then(waitFor(function () {
    return updateEvents.length
  }, 2))

  .then(function () {
    var orderedObjAttrs = [
      updateEvents[0].object.foo,
      updateEvents[1].object.foo
    ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 update events')
    t.is(orderedObjAttrs[0], '1', '1st event passes object')
    t.is(orderedObjAttrs[1], '2', '2nd event passes object')
  })
})

test('store.on("remove") with removing one', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()
  var removeEvents = []

  store.on('remove', addEventToArray.bind(null, removeEvents))

  store.add({
    id: 'one',
    foo: 'bar'
  })

  .then(function () {
    return store.remove('one')
  })

  .then(waitFor(function () {
    return removeEvents.length
  }, 1))

  .then(function () {
    t.is(removeEvents.length, 1, 'triggers 1 remove event')
    t.is(removeEvents[0].object.foo, 'bar', 'event passes object')
  })
})

test('store.on("remove") with removing two', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var removeEvents = []

  store.on('remove', addEventToArray.bind(null, removeEvents))

  store.add([
    {id: 'one'},
    {id: 'two'}
  ])

  .then(function () {
    return store.remove(['one', 'two'])
  })

  .then(waitFor(function () {
    return removeEvents.length
  }, 2))

  .then(function () {
    var orderedObjAttrs = [
        removeEvents[0].object.id,
        removeEvents[1].object.id
      ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 remove events')
    t.is(orderedObjAttrs[0], 'one', '1st event passes object')
    t.is(orderedObjAttrs[1], 'two', '2nd event passes object')
  })
})

test('store.on("remove") with remove all', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var removeEvents = []

  store.on('remove', addEventToArray.bind(null, removeEvents))

  store.add([
    {id: 'one'},
    {id: 'two'}
  ])

  .then(function () {
    return store.removeAll()
  })

  .then(waitFor(function () {
    return removeEvents.length
  }, 2))

  .then(function () {
    var orderedObjAttrs = [
        removeEvents[0].object.id,
        removeEvents[1].object.id
      ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 remove events')
    t.is(orderedObjAttrs[0], 'one', '1st event passes object')
    t.is(orderedObjAttrs[1], 'two', '2nd event passes object')
  })
})

test('store.on("change") with adding one', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var changeEvents = []

  store.on('change', addEventToArray.bind(null, changeEvents))

  store.add({
    foo: 'bar'
  })

  .then(waitFor(function () {
    return changeEvents.length
  }, 1))

  .then(function () {
    t.is(changeEvents.length, 1, 'triggers 1 change event')
    t.is(changeEvents[0].eventName, 'add', 'passes the event name')
    t.is(changeEvents[0].object.foo, 'bar', 'event passes object')
  })
})

test('store.on("change") with updating one', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var changeEvents = []

  store.add({
    id: 'test'
  })

  .then(function () {
    store.on('change', addEventToArray.bind(null, changeEvents))

    return store.update({
      id: 'test',
      foo: 'bar'
    })
  })

  .then(waitFor(function () {
    return changeEvents.length
  }, 1))

  .then(function () {
    t.is(changeEvents.length, 1, 'triggers 1 change event')
    t.is(changeEvents[0].eventName, 'update', 'passes the event name')
    t.is(changeEvents[0].object.foo, 'bar', 'event passes object')
  })
})

test('store.on("change") with removing one', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var changeEvents = []

  store.add({
    id: 'test',
    foo: 'bar'
  })

  .then(function () {
    store.on('change', addEventToArray.bind(null, changeEvents))

    return store.remove('test')
  })

  .then(waitFor(function () {
    return changeEvents.length
  }, 1))

  .then(function () {
    t.is(changeEvents.length, 1, 'triggers 1 change event')
    t.is(changeEvents[0].eventName, 'remove', 'passes the event name')
    t.is(changeEvents[0].object.foo, 'bar', 'event passes object')
  })
})

test('store.on("change") with adding one and updating it afterwards', function (t) {
  t.plan(5)

  var db = dbFactory()
  var store = db.hoodieApi()
  var changeEvents = []

  store.on('change', addEventToArray.bind(null, changeEvents))

  store.add({
    id: 'one',
    foo: 'bar'
  })

  .then(function () {
    return store.update({
      id: 'one',
      foo: 'baz'
    })
  })

  .then(waitFor(function () {
    return changeEvents.length
  }, 2))

  .then(function () {
    t.is(changeEvents.length, 2, 'triggers 2 change events')
    t.is(changeEvents[0].object.foo, 'bar', '1st event passes object')
    t.is(changeEvents[0].eventName, 'add', '1st event passes the event name')
    t.is(changeEvents[1].object.foo, 'baz', '2nd event passes object')
    t.is(changeEvents[1].eventName, 'update', '2nd event passes the event name')
  })
})

function addEventToArray (array, object) {
  if (arguments.length > 2) {
    arguments[0].push({
      eventName: arguments[1],
      object: arguments[2]
    })
  } else {
    arguments[0].push({
      object: arguments[1]
    })
  }
}
