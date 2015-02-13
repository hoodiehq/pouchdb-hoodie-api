'use strict'

module.exports = Store

function Store (db) {
  if (!(this instanceof Store)) return new Store(db)
  if (typeof db !== 'object' || typeof db.adapter !== 'string') throw new Error('Must pass a PouchDB')

  this.db = db
  this.PouchDB = db.constructor
}

Store.prototype.add = require('./lib/add')
Store.prototype.find = require('./lib/find')
