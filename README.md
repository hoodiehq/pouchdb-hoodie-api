# pouchdb-hoodie-api

> PouchDB plugin that provides Hoodie's store API

[![Build Status](https://travis-ci.org/boennemann/pouchdb-hoodie-api.svg?branch=master)](https://travis-ci.org/boennemann/pouchdb-hoodie-api)
[![Dependency Status](https://david-dm.org/boennemann/pouchdb-hoodie-api.svg)](https://david-dm.org/boennemann/pouchdb-hoodie-api)
[![NPM](https://nodei.co/npm/pouchdb-hoodie-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/pouchdb-hoodie-api/)

This plugin provides simple methods to add, find, update and remove data.

## Usage

```js
PouchDB.plugin(hoodieApi)
var db = new PouchDB('dbname')
var api = db.hoodieApi()

// all methods return promises
api.add(object)
api.add([object1, object2])
api.find(id)
api.find(object) // with id property
api.findOrAdd(id, object)
api.findOrAdd(object)
api.findOrAdd([object1, object2])
api.findAll()
api.findAll(filterFunction)
api.update(id, changedProperties)
api.update(id, updateFunction)
api.update(object)
api.update([object1, object2])
api.updateOrAdd(id, object)
api.updateOrAdd(object)
api.updateOrAdd([object1, object2])
api.updateAll(changedProperties)
api.updateAll(updateFunction)
api.remove(id)
api.remove(object)
api.removeAll()
api.removeAll(filterFunction)
api.clear()
```

Find the full API documentation at **TO BE DONE**


## Installation

### In the browser

To use this plugin, include it after `pouchdb.js` in your HTML page:

```html
<script src="pouchdb.js"></script>
<script src="pouchdb.hoodie-api.js"></script>
```

This plugin is also available from Bower:

```
bower install pouchdb
bower install pouchdb-hoodie-api
```

### In Node.js

Install via npm

```
npm install pouchdb
npm install pouchdb-hoodie-api
```

And then attach it to the `PouchDB` object

```js
var PouchDB = require('pouchdb')
PouchDB(require('pouchdb-hoodie-api'))
```


## Testing

[![Coverage Status](https://coveralls.io/repos/boennemann/pouchdb-hoodie-api/badge.svg)](https://coveralls.io/r/boennemann/pouchdb-hoodie-api)
[![devDependency Status](https://david-dm.org/boennemann/pouchdb-hoodie-api/dev-status.svg)](https://david-dm.org/boennemann/pouchdb-hoodie-api#info=devDependencies)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/db-pouch.svg)](https://saucelabs.com/u/db-pouch)

### In Node.js

Run all tests and validates JavaScript Code Style using [standard](https://www.npmjs.com/package/standard)

```
npm test
```

To run only the tests

```
npm run test:node
```

### In the browser

```
test:browser:local
```

This will start a local server. All tests and coverage will be run at http://localhost:8080/__zuul
