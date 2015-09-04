var Role = require('../models/role.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getNames = function(req, res) {
  Role.getNames(function(result) {
    res.json(result);
  });
};

exports.addOrEdit = function(req, res) {
  Role.addOrEdit(req.body, function(err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};

exports.remove = function(req, res) {
  Role.remove(req.query.id, function(success) {
    if (success) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
};

