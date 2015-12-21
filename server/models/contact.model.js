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

Contact.getAssociateNames = function(callback) {
  db.knex.raw('select atj.associate_id AS typeid,at.type as type, a.id AS id, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id GROUP BY name')
  .then(function(results) {
     callback(results[0]);
  });
}

Contact.addGetAssociateNamesById = function(AssociateData, callback) {
  if(AssociateData.associate_id!==-1 &&AssociateData.associte_types_id!==-1){
       db.knex.raw('select atj.associate_id AS typeid,at.type as type, a.id AS id, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.talent_id = '+AssociateData.talent_id+' AND atj.associate_id = '+AssociateData.associate_id+' AND atj.associte_types_id = '+AssociateData.associte_types_id)
        .then(function(results) {
          if(!results[0].length){
            db.knex('associate_talent_associate_type_join').insert([{talent_id: AssociateData.talent_id, associte_types_id: AssociateData.associte_types_id, associate_id: AssociateData.associate_id}])
            .then(function(results) {
              db.knex.raw('select atj.associate_id AS typeid,at.type as type, a.id AS id, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.talent_id = '+AssociateData.talent_id+' GROUP BY name')
              .then(function(results) {
                  callback(results[0]);
              });
            });
        }else{
          callback("Error");
        }
      });
      
  }else{
     db.knex.raw('select atj.associate_id AS typeid,at.type as type, a.id AS id, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.talent_id = '+AssociateData.talent_id+' GROUP BY name')
      .then(function(results) {
    	  var data = {};
    	  data.details = results[0];
         //callback(results[0]);
    	  
    	  db.knex.raw('select atj.associate_id AS typeid,at.type as type, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.associte_types_id=1 GROUP BY name')
          .then(function(results1) {
        	  data.agents = results1[0];
        	  
        	  db.knex.raw('select atj.associate_id AS typeid,at.type as type, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.associte_types_id=2 GROUP BY name')
              .then(function(results2) {
            	  data.managers = results2[0];
            	  
            	  db.knex.raw('select atj.associate_id AS typeid,at.type as type, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.associte_types_id=3 GROUP BY name')
                  .then(function(results3) {
                	  data.attornies = results3[0];
                	  
                	  db.knex.raw('select atj.associate_id AS typeid,at.type as type, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.associte_types_id=4 GROUP BY name')
                      .then(function(results4) {
                    	  data.publicists = results4[0];
                    	  callback(data);
                      });
                	  
                  });
            	  
              });
        	  
          });
    	  
      });
     
  }
  
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
        callback(null, {status: 'edit', text: 'Successfully edited contact', id: contact.get('id'), name: contact.get('first_name') + ' ' + contact.get('last_name')});

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
          callback(null, {status: 'edit', text: 'Successfully edited contact', id: contact.get('id'), name: contact.get('first_name') + ' ' + contact.get('last_name')});
        })
      } else {
        new Contact(contactData)
        .save()
        .then(function(contact) {
          callback(null, {status: 'add', text: 'New contact created', id: contact.get('id'), name: contact.get('first_name') + ' ' + contact.get('last_name')});
        });
      }
    }
  });
};

Contact.remove = function(contactId, callback) {
  new Contact({id: contactId})
  .fetch()
  .then(function(contact) {
    if (contact) {
      contact.destroy();
      return callback(true)
    } else {
      return callback(false);
    }
  });
};

module.exports = Contact;