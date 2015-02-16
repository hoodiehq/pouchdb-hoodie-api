'use strict'

module.exports = Store

function Store (db) {
  if (!(this instanceof Store)) return new Store(db)
  if (typeof db !== 'object' || typeof db.adapter !== 'string') throw new Error('Must pass a PouchDB')

  this.db = db
  this.PouchDB = db.constructor

  this.add = require('./lib/add').bind(this)
  this.find = require('./lib/find').bind(this)
  this.findAll = require('./lib/find-all').bind(this)
  this.findOrAdd = require('./lib/find-or-add').bind(this)
  this.update = require('./lib/update').bind(this)
  this.updateAll = require('./lib/update-all').bind(this)
  this.remove = require('./lib/remove').bind(this)
}
