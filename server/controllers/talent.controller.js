var Talent = require('../models/talent.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getAll = function(req, res) {
  Talent.getAll(function(result) {
    res.json(result);
  });
};

exports.getProfile = function(req, res) {
  var talentId = req.query.talent_id;
  Talent.getProfile(talentId, function(result) {
    res.json(result);
  });
};

exports.getNames = function(req, res) {
  Talent.getNames(function(result) {
    res.json(result);
  });
};

