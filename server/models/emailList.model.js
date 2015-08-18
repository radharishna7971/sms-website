var db = require('../config/db');
var EmailListEntry = require('../config/schema').EmailListEntry;

// Adds new email address to database if the email does not already exist
EmailListEntry.add = function(emailAddress, callback) {
  new EmailListEntry({email: emailAddress})
  .fetch()
  .then(function(email) {
    if (!email) {
      new EmailListEntry({email: emailAddress})
      .save()
      .then(function(email) {
        callback(email);
      })
    } else {
      callback(email);
    }
  });
};

module.exports = EmailListEntry;