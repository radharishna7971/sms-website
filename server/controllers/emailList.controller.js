var EmailListEntry = require('../models/emailList.model');
var Promise = require('bluebird');

exports.addEmail = function(req, res) {
  EmailListEntry.add(req.body.emailAddress, function(email) {
    res.json("Successfully added email");
  });
};