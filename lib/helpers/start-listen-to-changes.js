module.exports = startListenToChanges

function startListenToChanges (state) {
  state.db.changes({
    since: 'now',
    live: true,
    include_docs: true
  })
    .on('change', function (change) {
      var doc = change.doc

      if (!doc.hoodie) {
        doc.hoodie = {}
      }

      var eventName = doc.hoodie.deletedAt ? 'remove' : doc.hoodie.updatedAt ? 'update' : 'add'
      state.emitter.emit(eventName, doc)
      state.emitter.emit('change', eventName, doc)
    })
}
