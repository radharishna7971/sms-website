var Credit = require('../models/credit.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getNames = function(req, res) {
  Credit.getNames(function(result) {
    res.json(result);
  });
};

