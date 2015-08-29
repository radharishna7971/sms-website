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
};

Credit.get = function(id, callback) {
  db.knex.raw(' \
    SELECT \
      id, \
      name, \
      DATE_FORMAT(release_date, \"%m/%d/%Y\") AS release_date \
    FROM credits \
    WHERE id = ' + id)
  .then(function(results) {
     callback(results[0][0]);
  });
};

// Check to see that name does not already exists.  If it doesn't either edit or add new.  If it does exist and the id is the same, edit that credit.
Credit.addOrEdit = function(creditData, callback) {
  new Credit({name: creditData.name})
  .fetch()
  .then(function(credit) {
    // console.log("A", credit);
    if (credit) {
      if (credit.get('id') === creditData.id) {
        for (var key in creditData) {
          credit.set(key, creditData[key]);
          credit.save();
        }
        console.log(credit);
        callback(null, {status: 'edit', id: credit.get('id'), name: credit.get('name')});

      } else {
        return callback({status: 'error', text: "Credit already exists"});
      }
    } else {
      if (creditData.hasOwnProperty('id')) {
        new Credit({id: creditData.id})
        .fetch()
        .then(function(credit) {
          for (var key in creditData) {
            credit.set(key, creditData[key]);
            credit.save();
          }
          credit.save();
          callback(null, {status: 'edit', id: credit.get('id'), name: credit.get('name')});
        })
      } else {
        new Credit(creditData)
        .save()
        .then(function(credit) {
          callback(null, credit);
        });
      }
    }
  });
};


module.exports = Credit;

