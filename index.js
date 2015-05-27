'use strict'

var exports = module.exports = { hoodieApi: hoodieApi }

function hoodieApi () {
  return {
    db: this,
    add: require('./add').bind(this),
    find: require('./find').bind(this),
    findAll: require('./find-all').bind(this),
    findOrAdd: require('./find-or-add').bind(this),
    update: require('./update').bind(this),
    updateOrAdd: require('./update-or-add').bind(this),
    updateAll: require('./update-all').bind(this),
    remove: require('./remove').bind(this),
    removeAll: require('./remove-all').bind(this)
  }
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports)
}
