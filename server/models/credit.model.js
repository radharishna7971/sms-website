var db = require('../config/db');
var Credit = require('../config/schema').Credit;

// Return list of all credit names
Credit.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      id, \
      name \
    FROM credits')
  .then(function(results) {
     callback(results[0]);
  });
}

module.exports = Credit;

