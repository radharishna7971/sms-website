var Contact = require('../models/contact.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getNames = function(req, res) {
  Contact.getNames(function(result) {
    res.json(result);
  });
};

