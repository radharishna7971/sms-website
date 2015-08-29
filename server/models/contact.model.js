var db = require('../config/db');
var Contact = require('../config/schema').Contact;

// Return list of all contact names
Contact.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      id, \
      CONCAT(first_name, \' \', last_name) AS name \
    FROM contacts')
  .then(function(results) {
     callback(results[0]);
  });
}

module.exports = Contact;