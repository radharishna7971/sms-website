var Talent = require('../models/talent.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getAll = function(req, res) {
  Talent.getAll(function(result) {
    res.json(result);
  });
};

