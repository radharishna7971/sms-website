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

exports.getTalent = function(req, res) {
  Talent.get(req.query.id, function(result) {
    res.json(result);
  });
};

exports.addOrEdit = function(req, res) {
  Talent.addOrEdit(req.body, function(err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};

exports.remove = function(req, res) {
  Talent.remove(req.query.id, function(success) {
    if (success) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
};