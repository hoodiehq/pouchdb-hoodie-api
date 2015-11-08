var zuulConfig = module.exports = require('hoodie-zuul-config')

zuulConfig.scripts = [
  './node_modules/pouchdb/dist/pouchdb.js',
  './node_modules/pouchdb/dist/pouchdb.memory.js',
  './dist/pouchdb-hoodie-api.js'
]
