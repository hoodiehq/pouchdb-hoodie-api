'use strict'

// Filters out docs that shouldn't return in *All methods
module.exports = function filterExcluded (row) {
  return row.id.match(/^_design/) === null
}
