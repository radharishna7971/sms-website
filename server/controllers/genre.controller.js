var Genre = require('../models/genre.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getNames = function(req, res) {
  console.log("GET GENRE NAMES");
  Genre.getNames(function(result) {
    console.log(result);
    res.json(result);
  });
};


exports.addOrEdit = function(req, res) {
  Genre.addOrEdit(req.body, function(err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};
