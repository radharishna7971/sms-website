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
  db.knex.raw('select distinct a.id as id,CONCAT(a.firstName, \' \', a.lastName) AS name,at.id as typeid,at.type from associate a INNER JOIN associate_types at on `at`.id=a.types where deleted='+0+' group by name')
  .then(function(results) {
     callback(results[0]);
  });
}
Contact.getAssociateType = function(callback){
  db.knex.raw('SELECT id, type FROM associate_types')
  .then(function(results) {
     callback(results[0]);
  });
}

Contact.addGetAssociateNamesById = function(AssociateData, callback) {
  if(AssociateData.associate_id!==-1 &&AssociateData.associte_types_id!==-1){
	  console.log(AssociateData);
	  db.knex.raw('select  associate_id from associate_talent_associate_type_join where talent_id = '+AssociateData.talent_id+' AND associte_types_id = '+AssociateData.associte_types_id)
		.then(function(getAssociate) {
			if(getAssociate[0].length > 0){
				db.knex.raw('update associate_talent_associate_type_join set associate_id = '+AssociateData.associate_id+' where talent_id = '+AssociateData.talent_id+' AND associte_types_id = '+AssociateData.associte_types_id)
		        .then(function(associateUpdated) {
		        	console.log('updated');
		        	callback(true);
		        });
			}else{
				db.knex.raw('insert into associate_talent_associate_type_join (associate_id,talent_id,associte_types_id) VALUES ('+AssociateData.associate_id+','+AssociateData.talent_id+','+AssociateData.associte_types_id+')')
		        .then(function(associateInserted) {
		        	console.log('inserted');
		        	callback(true);
		        });
			}
		});
      
  }else{
     db.knex.raw('select atj.associate_id AS typeid,at.type as type, a.id AS id, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.talent_id = '+AssociateData.talent_id+' GROUP BY name')
      .then(function(results) {
    	  var data = {};
    	  data.details = results[0];
         //callback(results[0]);
    	  
    	  db.knex.raw('select atj.associate_id, `at`.id,at.type as type, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.associte_types_id=1 GROUP BY name')
          .then(function(results1) {
        	  data.agents = results1[0];
        	  
        	  db.knex.raw('select atj.associate_id, `at`.id,at.type as type, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.associte_types_id=2 GROUP BY name')
              .then(function(results2) {
            	  data.managers = results2[0];
            	  
            	  db.knex.raw('select atj.associate_id, `at`.id,at.type as type, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.associte_types_id=3 GROUP BY name')
                  .then(function(results3) {
                	  data.attornies = results3[0];
                	  
                	  db.knex.raw('select atj.associate_id, `at`.id,at.type as type, CONCAT(a.firstName, \' \', a.lastName) AS name from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id where atj.associte_types_id=4 GROUP BY name')
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
      firstName, \
      lastName, \
      email, \
      phone, \
      types \
    FROM associate \
    WHERE deleted = 0 AND id = ' + id)
  .then(function(results) {
     callback(results[0][0]);
  });
};

Contact.addOrEdit = function(contactData, callback) {
  var agent_id = typeof contactData['id'] === 'undefined'?-1:parseInt(contactData.id);
  var agent_type = parseInt(contactData.types);
  var fName = '"'+contactData.firstName+'"';
  var lName = '"'+contactData.lastName+'"';
  var emailId = '"'+contactData.email+'"';
  var phoneNum = '"'+contactData.phone+'"';
  db.knex.raw(' SELECT id, firstName, lastName, email, phone, types FROM associate WHERE id = '+ agent_id)
  .then(function(results) {
    if(results[0].length){
      db.knex.raw('UPDATE associate SET firstName='+fName+', lastName='+lName+', email='+emailId+', phone='+phoneNum+', types='+agent_type+' WHERE id = '+ agent_id)
        .then(function(results) {
            callback(null, {status: 'edit', id:agent_id, text: 'Successfully edited cls ,'+ contactData['firstName'] + ' ' + contactData['lastName'],name:contactData['firstName'] + ' ' + contactData['lastName']});
          });
     }else{
       db.knex.raw('SELECT id, firstName, lastName, email, phone, types FROM associate WHERE email = '+ emailId)
      .then(function(results) {
          var agent_email = " ";
          if(typeof results[0]!== "undefined"){
            if(parseInt(results[0].length)){
              agent_email = results[0].email;
            }           
          }
          if(typeof results[0][0]!== "undefined"){
              if(results[0][0].length){
                agent_email = results[0][0].email;
              }
          }
  
            if(contactData['email'] === agent_email){
              return callback({status: 'error', text: "Contact already exists"});
            }else{
              db.knex.raw('INSERT INTO associate (firstName, lastName, email, types, phone, deleted) VALUES('+fName+','+lName+','+emailId+','+agent_type+','+phoneNum+','+0+')')
                .then(function(results) {
                  db.knex.raw('SELECT max(id) as id FROM associate WHERE email = '+ emailId+'AND firstName='+fName+'AND lastName='+lName+'')
                  .then(function(results) {
                    console.log(results[0][0].id);
                      callback(null, {status: 'add', text: 'New contact created ',id:results[0][0].id, name:contactData['firstName'] + ' ' + contactData['lastName']});
                    });
                });
              //return callback({status: 'error', text: "Contact already exists"});
            }

         });
      }
    });
  };

Contact.remove = function(contactId, callback) {
  db.knex.raw(' SELECT id, firstName, lastName, email, phone, types FROM associate WHERE id = '+ contactId)
  .then(function(results) {
    if(results[0].length){
      db.knex.raw('UPDATE associate SET deleted='+1+' WHERE id = '+ contactId)
        .then(function(results) {
            callback(true);
          });
        }
     });
};

module.exports = Contact;