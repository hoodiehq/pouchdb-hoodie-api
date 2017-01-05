'use strict'

var test = require('tape')

var dbFactory = require('../utils/db')

test('store.withIdPrefix() exists', function (t) {
  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.withIdPrefix, 'function', 'has method')
  t.end()
})

test('store.withIdPrefix("test/") returns all methods but .clear', function (t) {
  var db = dbFactory()
  var store = db.hoodieApi()
  var testStore = store.withIdPrefix('test')

  Object.keys(store).filter(function (key) {
    return (typeof store[key] === 'function') && key !== 'clear'
  }).forEach(function (key) {
    t.is(typeof testStore[key], 'function', 'has method: ' + key)
  })

  t.end()
})

test('store.withIdPrefix("test/").add(properties)', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  testStore.add({
    foo: 'bar'
  })

  .then(function (doc) {
    t.ok(/^test\//.test(doc.id), 'prefixes id with "test/"')
    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").add([doc1, doc2])', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  testStore.add([{
    foo: 'bar'
  }, {
    baz: 'ar'
  }])

  .then(function (docs) {
    t.ok(/^test\//.test(docs[0].id), 'prefixes id with "test/"')
    t.ok(/^test\//.test(docs[1].id), 'prefixes id with "test/"')
    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").find("foo")', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.put({
    _id: 'test/foo'
  })

  .then(function () {
    return testStore.find('foo')
  })

  .then(function (doc) {
    t.pass('finds doc')
    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").find("test/foo")', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.put({
    _id: 'test/foo'
  })

  .then(function () {
    return testStore.find('test/foo')
  })

  .then(function (doc) {
    t.pass('finds doc')
    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").find(["foo", "test/bar"])', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.bulkDocs([{
    _id: 'test/foo'
  }, {
    _id: 'test/bar'
  }])

  .then(function () {
    return testStore.find(['foo', 'test/bar'])
  })

  .then(function (docs) {
    t.is(docs[0].id, 'test/foo', 'finds doc with id: test/foo')
    t.is(docs[1].id, 'test/bar', 'finds doc with id: test/bar')

    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").findOrAdd(id, object) when found', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.put({
    _id: 'test/foo',
    foo: 'bar'
  })

  .then(function () {
    return testStore.findOrAdd('foo', {foo: 'baz'})
  })

  .then(function (doc) {
    t.is(doc.foo, 'bar', 'finds doc')

    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").findOrAdd(id, object) when added', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  return testStore.findOrAdd('foo', {foo: 'baz'})

  .then(function (doc) {
    t.is(doc.foo, 'baz', 'adds doc')
    t.ok(/^test\//.test(doc.id), 'prefixes .id')

    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").findOrAdd([object1, object2])', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.put({
    _id: 'test/foo',
    foo: 'bar'
  })

  .then(function () {
    return testStore.findOrAdd([{
      id: 'foo',
      foo: 'baz'
    }, {
      id: 'baz',
      baz: 'ar'
    }])
  })

  .then(function (docs) {
    t.is(docs[0].foo, 'bar', 'finds doc with id: test/foo')
    t.is(docs[1].baz, 'ar', 'adds doc with id: test/baz')

    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").findAll()', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.bulkDocs([{
    _id: 'test/foo'
  }, {
    _id: 'bar'
  }])

  .then(function () {
    return testStore.findAll()
  })

  .then(function (docs) {
    t.is(docs.length, 1)
    t.is(docs[0].id, 'test/foo')

    t.end()
  })

  .catch(t.error)
})
test('store.withIdPrefix("test/").update(id, changedProperties)', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.put({
    _id: 'test/foo',
    foo: 'bar'
  })

  .then(function () {
    return testStore.update('foo', {foo: 'baz'})
  })

  .then(function (doc) {
    t.is(doc.foo, 'baz')

    t.end()
  })

  .catch(t.error)
})
test('store.withIdPrefix("test/").update([object1, object2])', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.bulkDocs([{
    _id: 'test/foo',
    foo: 'bar'
  }, {
    _id: 'test/bar',
    bar: 'baz'
  }])

  .then(function () {
    return testStore.update([{
      id: 'test/foo',
      foo: 'bar2'
    }, {
      id: 'test/bar',
      bar: 'baz2'
    }])
  })

  .then(function (docs) {
    t.is(docs.length, 2)
    t.is(docs[0].foo, 'bar2')
    t.is(docs[1].bar, 'baz2')

    t.end()
  })

  .catch(t.error)
})
test('store.withIdPrefix("test/").updateOrAdd(object) when found', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.put({
    _id: 'test/foo',
    foo: 'bar'
  })

  .then(function () {
    return testStore.updateOrAdd('foo', {foo: 'baz'})
  })

  .then(function (doc) {
    t.is(doc.foo, 'baz', 'finds doc')

    t.end()
  })

  .catch(t.error)
})
test('store.withIdPrefix("test/").updateOrAdd(object) when added', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  return testStore.updateOrAdd('foo', {foo: 'baz'})

  .then(function (doc) {
    t.ok(/^test\//.test(doc.id), 'adds doc')

    t.end()
  })

  .catch(t.error)
})
test('store.withIdPrefix("test/").updateOrAdd([object1, object2])', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.put({
    _id: 'test/foo',
    foo: 'bar'
  })

  .then(function () {
    return testStore.updateOrAdd([{
      id: 'foo',
      foo: 'baz'
    }, {
      id: 'baz',
      baz: 'ar'
    }])
  })

  .then(function (docs) {
    t.is(docs[0].foo, 'baz', 'finds doc with id: test/foo')
    t.is(docs[1].baz, 'ar', 'adds doc with id: test/baz')

    t.end()
  })

  .catch(t.error)
})
test('store.withIdPrefix("test/").updateAll(changedProperties)', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.bulkDocs([{
    _id: 'test/foo'
  }, {
    _id: 'bar'
  }])

  .then(function () {
    return testStore.updateAll({foo: 'bar'})
  })

  .then(function (docs) {
    t.is(docs.length, 1)
    t.is(docs[0].foo, 'bar')

    t.end()
  })

  .catch(t.error)
})
test('store.withIdPrefix("test/").remove(id)', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.put({
    _id: 'test/foo',
    foo: 'bar'
  })

  .then(function () {
    return testStore.remove('foo')
  })

  .then(function (doc) {
    t.is(doc.id, 'test/foo')

    t.end()
  })

  .catch(t.error)
})
test('store.withIdPrefix("test/").remove([object1, id2])', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.bulkDocs([{
    _id: 'test/foo',
    foo: 'bar'
  }, {
    _id: 'test/bar',
    bar: 'baz'
  }])

  .then(function () {
    return testStore.remove([{
      id: 'test/foo',
      foo: 'bar2'
    }, 'test/bar'])
  })

  .then(function (docs) {
    t.is(docs.length, 2)

    t.end()
  })

  .catch(t.error)
})
test('store.withIdPrefix("test/").removeAll()', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/')

  db.bulkDocs([{
    _id: 'test/foo'
  }, {
    _id: 'bar'
  }])

  .then(function () {
    return testStore.removeAll()
  })

  .then(function (docs) {
    t.is(docs.length, 1)
    t.is(docs[0].id, 'test/foo')

    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").withIdPrefix("onetwo/").add(properties)', function (t) {
  var db = dbFactory()
  var testStore = db.hoodieApi().withIdPrefix('test/').withIdPrefix('onetwo/')

  testStore.add({
    foo: 'bar'
  })

  .then(function (doc) {
    t.ok(/^test\/onetwo\//.test(doc.id), 'prefixes id with "test/onetwo/"')
    t.end()
  })

  .catch(t.error)
})

test('store.withIdPrefix("test/").on("change", handler) events', function (t) {
  t.plan(2)

  var store = dbFactory().hoodieApi()
  var testStore = store.withIdPrefix('test/')

  testStore.on('change', function (eventName, object) {
    t.is(object.id, 'test/foo')
  })

  testStore.on('add', function (object) {
    t.is(object.id, 'test/foo')
  })

  store.add({id: 'foo'})
  testStore.add({id: 'foo'})
})
