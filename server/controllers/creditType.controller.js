var CreditType = require('../models/creditType.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getNames = function(req, res) {
  CreditType.getNames(function(result) {
    res.json(result);
  });
};

exports.addOrEdit = function(req, res) {
  CreditType.addOrEdit(req.body, function(err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};

exports.remove = function(req, res) {
  CreditType.remove(req.query.id, function(success) {
    if (success) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
};

