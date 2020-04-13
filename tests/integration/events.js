'use strict'

var test = require('tape')
var dbFactory = require('../utils/db')

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

  store.on('add', function (object) {
    t.pass('triggers 1 add event')
    t.is(object.foo, 'bar', 'event passes object')
  })

  store.add({
    foo: 'bar'
  })
})

test('store.on("add") with adding two', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var objects = []

  store.on('add', function (object) {
    objects.push(object)

    if (objects.length < 2) {
      return
    }

    var orderedObjAttrs = [
      objects[0].foo,
      objects[1].foo
    ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 add event')
    t.is(orderedObjAttrs[0], 'bar', '1st event passes object')
    t.is(orderedObjAttrs[1], 'baz', '2nd event passes object')
  })

  store.add([
    { foo: 'bar' },
    { foo: 'baz' }
  ])
})

test('store.on("add") with one element added before registering event and one after', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({
    foo: 'bar'
  })

    .then(function () {
      store.on('add', function (object) {
        t.pass('triggers only 1 add event')
        t.is(object.foo, 'baz', 'event passes object')
      })

      store.add({
        foo: 'baz'
      })
    })
})

test('store.on("add") with add & update', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.on('add', function (object) {
    t.pass('triggers only 1 add event')
    t.is(object.nr, 1, 'event passes object')
  })

  store.updateOrAdd({
    _id: 'test',
    nr: 1
  })

    .then(function () {
      store.updateOrAdd('test', { nr: 2 })
    })
})

test('store.on("update") with updating one', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.on('update', function (object) {
    t.pass('triggers only 1 add event')
    t.is(object.foo, 'bar', 'event passes object')
  })

  store.add({
    _id: 'test'
  })

    .then(function (obj) {
      store.update({
        _id: 'test',
        foo: 'bar'
      })
    })
})

test('store.on("update") with updating two', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var objects = []

  store.on('update', function (object) {
    objects.push(object)

    if (objects.length < 2) {
      return
    }

    var orderedObjAttrs = [
      objects[0].foo,
      objects[1].foo
    ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 update event')
    t.is(orderedObjAttrs[0], 'bar', '1st event passes object')
    t.is(orderedObjAttrs[1], 'baz', '2nd event passes object')
  })

  store.add([
    { _id: 'first' },
    { _id: 'second' }
  ])

    .then(function (obj) {
      store.update([
        { _id: 'first', foo: 'bar' },
        { _id: 'second', foo: 'baz' }
      ])
    })
})

test('store.on("update") with add & update', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.on('update', function (object) {
    t.pass('triggers 1 update event')
    t.is(object.nr, 2, 'event passes object')
  })

  store.updateOrAdd({
    _id: 'test',
    nr: 1
  })

    .then(function () {
      store.updateOrAdd('test', { nr: 2 })
    })
})

test('store.on("update") with update all', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var objects = []

  store.on('update', function (object) {
    objects.push(object)

    if (objects.length < 2) {
      return
    }

    var orderedObjAttrs = [
      objects[0].foo,
      objects[1].foo
    ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 update events')
    t.is(orderedObjAttrs[0], '1', '1st event passes object')
    t.is(orderedObjAttrs[1], '2', '2nd event passes object')
  })

  store.add([
    { _id: 'first', foo: '1' },
    { _id: 'second', foo: '2' }
  ])

    .then(function () {
      store.updateAll({
        bar: 'baz'
      })
    })
})

test('store.on("remove") with removing one', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.on('remove', function (object) {
    t.pass('triggers 1 remove event')
    t.is(object.foo, 'bar', 'event passes object')
  })

  store.add({
    _id: 'one',
    foo: 'bar'
  })

    .then(function () {
      return store.remove('one')
    })
})

test('store.on("remove") with removing two', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var objects = []

  store.on('remove', function (object) {
    objects.push(object)

    if (objects.length < 2) {
      return
    }

    var orderedObjAttrs = [
      objects[0]._id,
      objects[1]._id
    ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 remove events')
    t.is(orderedObjAttrs[0], 'one', '1st event passes object')
    t.is(orderedObjAttrs[1], 'two', '2nd event passes object')
  })

  store.add([
    { _id: 'one' },
    { _id: 'two' }
  ])

    .then(function () {
      store.remove(['one', 'two'])
    })
})

test('store.on("remove") with remove all', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var objects = []

  store.on('remove', function (object) {
    objects.push(object)

    if (objects.length < 2) {
      return
    }

    var orderedObjAttrs = [
      objects[0]._id,
      objects[1]._id
    ].sort()

    t.is(orderedObjAttrs.length, 2, 'triggers 2 remove events')
    t.is(orderedObjAttrs[0], 'one', '1st event passes object')
    t.is(orderedObjAttrs[1], 'two', '2nd event passes object')
  })

  store.add([
    { _id: 'one' },
    { _id: 'two' }
  ])

    .then(function () {
      store.removeAll()
    })
})

test('store.on("change") with adding one', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.on('change', function (eventName, object) {
    t.pass('triggers 1 change event')
    t.is(eventName, 'add', 'passes the event name')
    t.is(object.foo, 'bar', 'event passes object')
  })

  store.add({
    foo: 'bar'
  })
})

test('store.on("change") with updating one', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  store.add({
    _id: 'test'
  })

    .then(function () {
      store.on('change', function (eventName, object) {
        t.pass('triggers 1 change event')
        t.is(eventName, 'update', 'passes the event name')
        t.is(object.foo, 'bar', 'event passes object')
      })

      store.update({
        _id: 'test',
        foo: 'bar'
      })
    })
})

test('store.on("change") with removing one', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({
    _id: 'test',
    foo: 'bar'
  })

    .then(function () {
      store.on('change', function (eventName, object) {
        t.pass('triggers 1 change event')
        t.is(eventName, 'remove', 'passes the event name')
        t.is(object.foo, 'bar', 'event passes object')
      })

      store.remove('test')
    })
})

test('store.on("change") with adding one and updating it afterwards', function (t) {
  t.plan(4)

  var db = dbFactory()
  var store = db.hoodieApi()

  function handleFirstChange (eventName, object) {
    t.is(object.foo, 'bar', '1st event passes object')
    t.is(eventName, 'add', '1st event passes the event name')

    store.on('change', handleSecondChange)
  }

  function handleSecondChange (eventName, object) {
    t.is(object.foo, 'baz', '2nd event passes object')
    t.is(eventName, 'update', '2nd event passes the event name')
  }

  store.one('change', handleFirstChange)

  store.add({
    _id: 'one',
    foo: 'bar'
  })

    .then(function () {
      store.update({
        _id: 'one',
        foo: 'baz'
      })
    })
})

test('store.off("add") with one add handler', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  var addHandler = function () {
    t.fail('should not trigger add event')
  }

  store.on('add', addHandler)
  store.on('change', function () {
    t.pass('triggers change event')
  })
  store.off('add', addHandler)

  store.add({
    foo: 'bar'
  })
})

test('store.off("add") with removing one of two add handlers', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  var firstAddHandler = function () {
    t.fail('should not call first event handler')
  }

  var secondAddHandler = function () {
    t.pass('should call second event handler')
  }

  store.on('add', firstAddHandler)
  store.on('add', secondAddHandler)
  store.off('add', firstAddHandler)

  store.add({
    foo: 'bar'
  })
})

test('store.off("update") with one update handler', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  var updateHandler = function () {
    t.fail('should not trigger update event')
  }

  store.on('update', updateHandler)
  store.on('change', function (eventName) {
    if (eventName === 'update') {
      t.pass('triggers change event')
    }
  })
  store.off('update', updateHandler)

  store.add({
    foo: 'bar'
  })

    .then(store.update)
})

test('store.off("remove") with one remove handler', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  var removeHandler = function () {
    t.fail('should not trigger remove event')
  }

  store.on('remove', removeHandler)
  store.on('change', function (eventName) {
    if (eventName === 'remove') {
      t.pass('triggers change event')
    }
  })
  store.off('remove', removeHandler)

  store.add({
    foo: 'bar'
  })

    .then(store.remove)
})

test('store.one("add") with adding one', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.one('add', function (object) {
    t.pass('triggers 1 add event')
    t.is(object.foo, 'bar', 'event passes object')
  })

  store.add({
    foo: 'bar'
  })
})

test('store.one("add") with adding two', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.one('add', function () {
    t.pass('store.one handler')
  })
  store.on('add', function () {
    t.pass('store.on handler')
  })

  store.add([
    { foo: 'bar' },
    { foo: 'baz' }
  ])
})

test('store.one("add") with add & update', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.one('add', function (object) {
    t.pass('store.one handler')
    t.is(object.nr, 1, 'event passes object')
  })

  store.add({ _id: 'test', nr: 1 })

    .then(function () {
      store.updateOrAdd('test', { nr: 2 })
    })
})

test('store.one("add") with one element added before registering event and one after', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()

  store.add({
    foo: 'bar'
  })

    .then(function () {
      store.one('add', function (object) {
        t.pass('store.one handler')
        t.is(object.foo, 'baz', 'event passes object')
      })

      store.add({
        foo: 'baz'
      })
    })
})

test('store.on returns store', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()
  var isFunction = store.on('add', noop) && typeof store.on('add', noop).on === 'function'

  t.ok(isFunction, 'allows chaining')
})

test('store.one returns store', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()
  var isFunction = store.one('add', noop) && typeof store.one('add', noop).on === 'function'

  t.ok(isFunction, 'allows chaining')
})

test('store.off returns store', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()
  var isFunction = store.off('add', noop) && typeof store.off('add', noop).on === 'function'

  t.ok(isFunction, 'allows chaining')
})

// We rely on PouchDB’s .changes() feed for events and hence have no control
// on when the events get triggered. Most often they seem to be emitted after
// the respective methods resolve, but not always. We could guarantee that events
// get emitted before a method resolves, but only with a tremendous amount of
// added complexity, so we decided against it and instead document that fact.
// But we left this test for reference, maybe things will change in future.
// see also: https://github.com/hoodiehq/pouchdb-hoodie-api/issues/54
test.skip('events should emit before methods resolve', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()
  var eventTriggered = false

  store.on('add', function () {
    eventTriggered = true
  })

  store.add().then(function () {
    t.ok(eventTriggered)
  })
})

function noop () {}
