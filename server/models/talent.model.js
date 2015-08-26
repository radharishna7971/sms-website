var db = require('../config/db');
var Talent = require('../config/schema').Talent;

// Get all talent from the database
Talent.getAll = function(callback) {
  db.knex.raw(' \
    SELECT * FROM talent LEFT JOIN contacts on talent.self_id = contacts.id \
  ')
  .then(function(results) {
     var data = results[0];
     callback(data);
  });
};

module.exports = Talent;