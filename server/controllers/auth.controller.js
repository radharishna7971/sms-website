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
      });
    }
  });
};

exports.create = function(req, res) {
  var userData = req.body;
  User.create(userData, function(error, user) {
    if (error) {
      res.status(422);
      res.send("Invalid credentials");
    } else {
      var token = jwt.encode(user.get('id'), jwtSecret);
      res.json({
        token: token,
        name: user.get('first_name') + ' ' + user.get('last_name'),
      });
    }
  });
};