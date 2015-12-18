var Contact = require('../models/contact.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getNames = function(req, res) {
  Contact.getNames(function(result) {
    res.json(result);
  });
};
exports.getAssociateNames = function(req, res) {
  Contact.getAssociateNames(function(result) {
    res.json(result);
  });
};

exports.addGetAssociateNamesById = function(req, res) {
  //console.log(req.body);
  Contact.addGetAssociateNamesById(req.body, function(result) {
    res.json(result);
  });
};

exports.getContact = function(req, res) {
  Contact.get(req.query.id, function(result) {
    res.json(result);
  });
};

exports.addOrEdit = function(req, res) {
  Contact.addOrEdit(req.body, function(err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};

exports.remove = function(req, res) {
  Contact.remove(req.query.id, function(success) {
    if (success) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
};

