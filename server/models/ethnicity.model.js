var db = require('../config/db');
var Ethnicity = require('../config/schema').Ethnicity;

// Return list of all ethnicity names
Ethnicity.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      id, \
      name \
    FROM ethnicity')
  .then(function(results) {
     callback(results[0]);
  });
};

// Check to see that name does not already exists.  If it doesn't either edit or add new
Ethnicity.addOrEdit = function(ethnicityData, callback) {
  new Ethnicity({name: ethnicityData.name})
  .fetch()
  .then(function(ethnicity) {
    if (ethnicity) {
      if (ethnicity.get('id') === ethnicityData.id) {
        callback(null, {status: 'edit', text: 'Successfully edited ethnicity', id: ethnicity.get('id'), name: ethnicity.get('name')});
      } else {
        return callback({status: 'error', text: "Ethnicity already exists"});
      }
    } else {
      if (ethnicityData.hasOwnProperty('id')) {
        new Ethnicity({id: ethnicityData.id})
        .fetch()
        .then(function(ethnicity) {
          ethnicity.set('name', ethnicityData.name);
          ethnicity.set('last_edited', ethnicityData.last_edited);
          ethnicity.save();
          callback(null, {status: 'edit', text: 'Successfully edited ethnicity', id: ethnicity.get('id'), name: ethnicity.get('name')});
        });
      } else {
        new Ethnicity({name: ethnicityData.name})
        .save()
        .then(function(ethnicity) {
          callback(null, {status: 'add', text: 'Created new ethnicity', id: ethnicity.get('id'), name: ethnicity.get('name')});
        });
      }
    }
  });
};

Ethnicity.remove = function(ethnicityId, callback) {
  new Ethnicity({id: ethnicityId})
  .fetch()
  .then(function(ethnicity) {
    if (ethnicity) {
      ethnicity.destroy();
      return callback(true);
    } else {
      return callback(false);
    }
  });
};

module.exports = Ethnicity;