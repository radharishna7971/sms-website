var User = require('../models/user.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.login = function(req, res) {
  var userData = req.body;
  User.authenticate(userData, function(error, user) {
    if (error) {
      res.status(422);
      res.send("Invalid credentials");
    } else {
      var token = jwt.encode(user.get('id'), jwtSecret);
      res.json({
        token: token,
        name: user.get('first_name') + ' ' + user.get('last_name'),
        id: user.get('id'),
        permission: user.get('permission')
      });
    }
  });
};

exports.create = function(req, res) {
  var userData = req.body;
  User.create(userData, function(error, user) {
    if (error) {
      res.json({error: "User already exists"});
    } else {
      res.json(user);
    }
  });
};

exports.validate = function(req, res) {
  var token = req.body.token;
  try {
    var userId = jwt.decode(token, jwtSecret);
    User.validate(userId, function(valid) {
      res.send(valid);
    });
  }
  catch(err) {
    res.send(false);
  }
};

exports.getUsers = function(req, res) {
  // Make sure that user accessing data has proper access
  var token = req.query.token;

  console.log(token);
  var userId = jwt.decode(token, jwtSecret);
  User.validate(userId, function(valid) {
    if (valid) {
      User.getAll(function(users) {
        res.json(users);
      });
    } else {
      res.send("Invalid credentials");
    }
  });

};