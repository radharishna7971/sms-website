var Credit = require('../models/credit.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getNames = function(req, res) {
  Credit.getNames(function(result) {
    res.json(result);
  });
};

exports.namesByChars = function(req, res) {
  Credit.namesByChars(req.query.Chars, function(result) {
    res.json(result);
  });
};

exports.getCredit = function(req, res) {
  Credit.get(req.query.id, function(result) {
    res.json(result);
  });
};

exports.addOrEdit = function(req, res) {
  Credit.addOrEdit(req.body, function(err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};

exports.remove = function(req, res) {
  Credit.remove(req.query.id, function(success) {
    if (success) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
};