var db = require('../config/db');
var CreditType = require('../config/schema').CreditType;

// Return list of all credit type names
CreditType.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      id, \
      name \
    FROM credit_types')
  .then(function(results) {
     callback(results[0]);
  });
};

// Check to see that name does not already exists.  If it doesn't either edit or add new
CreditType.addOrEdit = function(creditTypeData, callback) {
  new CreditType({name: creditTypeData.name})
  .fetch()
  .then(function(creditType) {
    if (creditType) {
      if (creditType.get('id') === creditTypeData.id) {
        callback(null, {status: 'edit', text: 'Successfully edited credit type', id: creditType.get('id'), name: creditType.get('name')});
      } else {
        return callback({status: 'error', text: "Credit type already exists"});
      }
    } else {
      if (creditTypeData.hasOwnProperty('id')) {
        new CreditType({id: creditTypeData.id})
        .fetch()
        .then(function(creditType) {
          creditType.set('name', creditTypeData.name);
          creditType.save();
          callback(null, {status: 'edit', text: 'Successfully edited credit type', id: creditType.get('id'), name: creditType.get('name')});
        });
      } else {
        new CreditType({name: creditTypeData.name})
        .save()
        .then(function(creditType) {
          callback(null, {status: 'add', text: 'Created new credit type', id: creditType.get('id'), name: creditType.get('name')});
        });
      }
    }
  });
};

CreditType.remove = function(creditTypeId, callback) {
  new CreditType({id: creditTypeId})
  .fetch()
  .then(function(creditType) {
    if (creditType) {
      creditType.destroy();
      return callback(true);
    } else {
      return callback(false);
    }
  });
};

module.exports = CreditType;