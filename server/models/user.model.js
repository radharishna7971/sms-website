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
  var udatedUserData = {};
  udatedUserData.permission=userData.permission;
  udatedUserData.first_name=userData.first_name;
  udatedUserData.last_name=userData.last_name;
  udatedUserData.password=userData.password;
  udatedUserData.email=userData.email;
  new User({'email': udatedUserData.email})
  .fetch()
  // .fetch() returns a promise so we call .then()
  .then(function(user) {
    // If the username is not already in the database...
    if (!user) {
      // Create a new user with all of the info from userData
      bcrypt.genSalt(5, function(err, salt) {
        // Replace password with hashed version
        bcrypt.hash(udatedUserData.password, salt, function(err, hash) {
          udatedUserData.password = hash;
          user = new User(udatedUserData)
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

User.update = function(userData, callback) {
  var udatedUserData = {};
  udatedUserData.id=userData.id;
  udatedUserData.permission=userData.permission;
  udatedUserData.first_name=userData.first_name;
  udatedUserData.last_name=userData.last_name;
  udatedUserData.password=userData.password;
  udatedUserData.email=userData.email;
  if(userData.resetPassword!==''){
      bcrypt.genSalt(5, function(err, salt) {
      // Replace resetPassword with hashed version
      bcrypt.hash(userData.resetPassword, salt, function(err, hash) {
          userData.resetPassword = hash;
          udatedUserData.password = userData.resetPassword;
          db.knex('users')
          .where('id', '=', udatedUserData.id)
          .update(
            udatedUserData
          )
          .then(function(users) {
            callback(null,users);
          });
      });
    });
  }else{
      db.knex('users')
      .where('id', '=', udatedUserData.id)
      .update(
        udatedUserData
      )
      .then(function(users) {
        callback(null,users);
      });
  }
  
};


User.addRows = function(rowsData, callback) {
    
    //Add update data base record 
    console.log(rowsData);
     callback(null,1);
    //callback(1);
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
User.getUserDetailsById = function(id,callback) {
   db.knex.select('*').from('users').where('id', id)
  .then(function(users) {
    callback(users);
  });
};

// Returns array of all users
User.getAll = function(callback) { 
  db.knex.select('id','first_name', 'last_name', 'email', 'permission', 'last_logged_in').from('users')
  .then(function(users) {
    callback(users);
  });
};

//Validates the token saved in localStorage
User.logout = function(id, callback) {
  db.knex.raw('update users set last_logged_in=now() where id='+id)
	.then(function(userUpdated) {
		new User({'id': id})
		  .fetch()
		  .then(function(user) {
			  callback(user);
		  });
	});
};

module.exports = User;