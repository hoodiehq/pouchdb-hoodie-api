var zuulConfig = module.exports = require('hoodie-zuul-config')

zuulConfig.scripts = [
  './dist/pouchdb-memory.js',
  './dist/pouchdb-hoodie-api.js'
]
