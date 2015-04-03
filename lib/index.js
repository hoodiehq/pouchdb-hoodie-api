'use strict'

module.exports = Store

function Store (db) {
  if (!(this instanceof Store)) return new Store(db)
  if (typeof db !== 'object' || typeof db.adapter !== 'string') throw new Error('Must pass a PouchDB')

  this.db = db
  this.PouchDB = db.constructor

  this.add = require('./add').bind(this)
  this.find = require('./find').bind(this)
  this.findAll = require('./find-all').bind(this)
  this.findOrAdd = require('./find-or-add').bind(this)
  this.update = require('./update').bind(this)
  this.updateOrAdd = require('./update-or-add').bind(this)
  this.updateAll = require('./update-all').bind(this)
  this.remove = require('./remove').bind(this)
}
