var db = require('../config/db');
var Contact = require('../config/schema').Contact;

// Return list of all contact names
Contact.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      id, \
      CONCAT(first_name, \' \', last_name) AS name \
    FROM contacts')
  .then(function(results) {
     callback(results[0]);
  });
}

Contact.get = function(id, callback) {
  db.knex.raw(' \
    SELECT \
      id, \
      first_name, \
      last_name, \
      email, \
      phone \
    FROM contacts \
    WHERE id = ' + id)
  .then(function(results) {
     callback(results[0][0]);
  });
};

Contact.addOrEdit = function(contactData, callback) {
  new Contact({email: contactData.email})
  .fetch()
  .then(function(contact) {
    // If contact with email already exists, check to see if it has the same id, if so, update data
    if (contact) {
      if (contact.get('id') === contactData.id) {
        for (var key in contactData) {
          contact.set(key, contactData[key]);
          contact.save();
        }
        callback(null, {status: 'edit', id: contact.get('id'), name: contact.get('first_name') + ' ' + contact.get('last_name')});

      } else { // Otherwise the contact already exists
        return callback({status: 'error', text: "Contact already exists"});
      }
    } else {
      if (contactData.hasOwnProperty('id')) {
        new Contact({id: contactData.id})
        .fetch()
        .then(function(contact) {
          for (var key in contactData) {
            contact.set(key, contactData[key]);
            contact.save();
          }
          contact.save();
          callback(null, {status: 'edit', id: contact.get('id'), name: contact.get('first_name') + ' ' + contact.get('last_name')});
        })
      } else {
        new Contact(contactData)
        .save()
        .then(function(contact) {
          callback(null, {id: contact.get('id'), name: contact.get('first_name') + ' ' + contact.get('last_name')});
        });
      }
    }
  });
};

module.exports = Contact;