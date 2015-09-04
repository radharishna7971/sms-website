var db = require('../config/db');
var Role = require('../config/schema').Role;

// Return list of all role names
Role.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      id, \
      name \
    FROM roles')
  .then(function(results) {
     callback(results[0]);
  });
}

// Check to see that name does not already exists.  If it doesn't either edit or add new
Role.addOrEdit = function(roleData, callback) {
  new Role({name: roleData.name})
  .fetch()
  .then(function(role) {
    if (role) {
      return callback({status: 'error', text: "Role already exists"});
    } else {
      if (roleData.hasOwnProperty('id')) {
        new Role({id: roleData.id})
        .fetch()
        .then(function(role) {
          role.set('name', roleData.name);
          role.save();
          callback(null, {status: 'edit', id: role.get('id'), name: role.get('name')});
        })
      } else {
        new Role({name: roleData.name})
        .save()
        .then(function(role) {
          callback(null, role);
        });
      }
    }
  });
};

Role.remove = function(roleId, callback) {
  new Role({id: roleId})
  .fetch()
  .then(function(role) {
    if (role) {
      role.destroy();
      return callback(true)
    } else {
      return callback(false);
    }
  });
};

module.exports = Role;