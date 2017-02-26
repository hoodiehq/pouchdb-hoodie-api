module.exports = startListenToChanges

var toObject = require('../utils/to-object')

function startListenToChanges (state) {
  state.db.changes({
    since: 'now',
    live: true,
    include_docs: true
  })
  .on('change', function (change) {
    var doc = change.doc

    var eventName = doc.deletedAt ? 'remove' : doc.updatedAt ? 'update' : 'add'
    state.emitter.emit(eventName, toObject(doc))
    state.emitter.emit('change', eventName, toObject(doc))
  })
}
