var db = require('../config/db');
var User = require('../config/schema').User;
var bcrypt = require('bcrypt');

User.authenticate = function(userData, callback) {
    // Try to find user with submitted email
  new User({email: userData.email})
  .fetch()
  .then(function(user) {
    // If no user with this email address exists, return an error
    if (!user) {
      callback("User not found.");
    // If user with this email does exist
    } else {
      // Confirm that the account has not been disabled
      if (parseInt(user.get('permission')) === 4) {
        callback("Account disabled", null);
      } else {
        // Then validate the entered password
        bcrypt.compare(userData.password, user.get('password'), function(err, res) {
          // If the password is valid, return the user
          if (res) {
            callback(null, user);
          // Otherise return error
          } else {
            callback("Incorrect password", null);
          }
        });
      }
    }
  });
};

User.create = function(userData, callback) {
  new User({'email': userData.email})
  .fetch()
  // .fetch() returns a promise so we call .then()
  .then(function(user) {
    // If the username is not already in the database...
    if (!user) {
      // Create a new user with all of the info from userData
      bcrypt.genSalt(5, function(err, salt) {
        // Replace password with hashed version
        bcrypt.hash(userData.password, salt, function(err, hash) {
          userData.password = hash;
          user = new User(userData)
          .save()
          .then(function(user) {
            callback(null, user);
          });
        });
      });
    } else {
      callback("User already exists.\n");
    }
  });
};

// Validates the token saved in localStorage
User.validate = function(id, callback) {
  new User({'id': id})
  .fetch()
  .then(function(user) {
    // Return true or false depending on whether or not the user exists and has valid permissions
    // We check permissions here in case a user's account is disabled while logged in
    return callback(!!user && parseInt(user.get('permission')) < 4);
  });
};

// Returns array of all users
User.getAll = function(callback) {
  db.knex.select('first_name', 'last_name', 'email', 'permission').from('users')
  .then(function(users) {
    callback(users);
  });
};

module.exports = User;