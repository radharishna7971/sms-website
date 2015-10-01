var db = require('../config/db');
var Talent = require('../config/schema').Talent;

// Get all talent from the database
Talent.getAll = function(callback) {
  db.knex.raw(' \
    SELECT \
      talent.id AS id, \
      CONCAT(talent.first_name, \' \', talent.last_name) AS name, \
      talent.last_name AS last_name, \
      role1.name AS primary_role, \
      role2.name AS secondary_role, \
      genre1.name AS primary_genre, \
      genre2.name AS secondary_genre, \
      CONCAT(partner.first_name, \' \', partner.last_name) AS partner, \
      talent.location \
    FROM talent \
      LEFT JOIN roles AS role1 ON talent.primary_role_id = role1.id \
      LEFT JOIN roles AS role2 ON talent.secondary_role_id = role2.id \
      LEFT JOIN genres AS genre1 ON talent.primary_genre_id = genre1.id \
      LEFT JOIN genres AS genre2 ON talent.secondary_genre_id = genre2.id \
      LEFT JOIN talent AS partner ON talent.partner_id = partner.id \
  ')
  .then(function(results) {
     var data = results[0];
     callback(data);
  });
};

Talent.getProfile= function(talentId, callback) {
  db.knex.raw(' \
    SELECT \
      talent.id AS id, \
      CONCAT(talent.first_name, \' \', talent.last_name) AS name, \
      talent.phone, \
      talent.email, \
      role1.name AS primary_role, \
      role2.name AS secondary_role, \
      genre1.name AS primary_genre, \
      genre2.name AS secondary_genre, \
      talent.gender, \
      talent.location, \
      talent.photo_url, \
      talent.imdb_url, \
      talent.linkedin_url, \
      talent.facebook_url, \
      talent.youtube_url, \
      talent.vine_url, \
      talent.instagram_url, \
      CONCAT(manager.first_name, \' \', manager.last_name) AS manager, \
      CONCAT(agent.first_name, \' \', agent.last_name) AS agent, \
      CONCAT(partner.first_name, \' \', partner.last_name) AS partner \
    FROM talent \
      LEFT JOIN roles AS role1 ON talent.primary_role_id = role1.id \
      LEFT JOIN roles AS role2 ON talent.secondary_role_id = role2.id \
      LEFT JOIN genres AS genre1 ON talent.primary_genre_id = genre1.id \
      LEFT JOIN genres AS genre2 ON talent.secondary_genre_id = genre2.id \
      LEFT JOIN contacts AS manager ON talent.manager_id = manager.id \
      LEFT JOIN contacts AS agent ON talent.agent_id = agent.id \
      LEFT JOIN contacts AS partner ON talent.partner_id = partner.id \
    WHERE talent.id = ' + talentId)
  .then(function(results) {
     var data = results[0][0];
     db.knex.raw(' \
       SELECT \
        credits.name, \
        credits.release_date \
       FROM talent_credit_join, credits, talent \
       WHERE talent.id = talent_credit_join.talent_id \
        AND talent_credit_join.credit_id = credits.id \
        AND talent.id = ' + data.id.toString())
     .then(function(results) {
        data.credits = results[0] || [];
        db.knex.raw(' \
          SELECT \
            comments.text AS text, \
            CONCAT(users.first_name, \' \', users.last_name) AS name, \
            comments.created_at AS date, \
            comments.id AS comment_id, \
            talent.id AS talent_id \
          FROM comments, talent, users \
          WHERE comments.talent_id = talent.id \
          AND comments.deleted = false \
          AND comments.user_id = users.id \
          AND talent.id = ' + data.id.toString())
        .then(function(results) {
          data.comments = results[0] || [];
          callback(data);
        });
     });
  });
};

// Return list of all talent names
Talent.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      talent.id AS id, \
      CONCAT(talent.first_name, \' \', talent.last_name) AS name, \
      talent.last_name AS last_name \
    FROM talent')
  .then(function(results) {
     callback(results[0]);
  });
};

Talent.getName = function(id, callback) {
  db.knex.raw(' \
    SELECT \
      CONCAT(talent.first_name, \' \', talent.last_name) AS name \
    FROM talent \
    WHERE talent.id = ' + id)
  .then(function(results) {
    callback(results[0][0].name);
  });
}

Talent.get = function(id, callback) {
  db.knex.raw(' \
    SELECT \
      id AS id, \
      first_name, \
      last_name, \
      email, \
      phone, \
      gender, \
      location, \
      primary_role_id, \
      secondary_role_id, \
      primary_genre_id, \
      secondary_genre_id, \
      imdb_url, \
      linkedin_url, \
      facebook_url, \
      youtube_url, \
      photo_url, \
      vine_url, \
      instagram_url, \
      agent_id, \
      manager_id, \
      partner_id \
    FROM talent \
    WHERE id = ' + id)
  .then(function(results) {
     var data = results[0][0];
     db.knex.raw(' \
       SELECT \
         comments.text AS text, \
         CONCAT(users.first_name, \' \', users.last_name) AS name, \
         comments.created_at AS date, \
         comments.id AS comment_id, \
         talent.id AS talent_id \
       FROM comments, talent, users \
       WHERE comments.talent_id = talent.id \
       AND comments.deleted = false \
       AND comments.user_id = users.id \
       AND talent.id = ' + data.id.toString())
     .then(function(results) {
      data.comments = results[0];
      callback(data);
     });
  });
};

// if first name and last name exists
  // if email matches
    // edit
  // else 
    // already exists
// else if email matches
  // already exists
// else 
  // create new user

Talent.addOrEdit = function(talentData, callback) {
  // Check to see if talent exists with same name
  new Talent({first_name: talentData.first_name, last_name: talentData.last_name})
  .fetch()
  .then(function(talent) {
    // If talent exists
    if (talent) {
      // If the email matches, then edit the data
      if (talent.get('email') === talentData.email || talent.get('id') === talentData.id) {
        for (var key in talentData) {
          talent.set(key, talentData[key]);
          talent.save();
        }
        talent.save()
        .then(function() {
          Talent.getName(talent.get('id'), function(name) {
            callback(null, {status: 'edit', text: 'Successfully edited ' + name, id: talent.get('id'), name: name});
          });
        })
      } else {
        // Given name already exists with different email
        return callback({status: 'error', text: "Talent with same name already exists"});
      }
    // If talent with given name doesn't exist
    } else {
      // Check to see if talent exists with given email
      new Talent({email: talentData.email})
      .fetch()
      .then(function(talent) {
        // If talent with given email exists, return error
        if (talent) {
          if (talent.get('id') === talentData.id) {
            for (var key in talentData) {
              talent.set(key, talentData[key]);
              talent.save();
            }
            talent.save()
            .then(function() {
              Talent.getName(talent.get('id'), function(name) {
                callback(null, {status: 'edit', text: 'Successfully edited ' + name, id: talent.get('id'), name: name});
              });
            });
          } else {
            return callback({status: 'error', text: "Talent with same email already exists"});
          }
        } else {
          // Otherwise create new talent
          new Talent(talentData)
          .save()
          .then(function(talent) {
            Talent.getName(talent.get('id'), function(name) {
             callback(null, {status: 'add', text: 'Added new talent', id: talent.get('id'), name: name});
            });
          });
        }
      });
    }
  })
};

// If parter
Talent.matchPartner = function(parterId1, partnerId2) {

}


Talent.remove = function(talentId, callback) {
  new Talent({id: talentId})
  .fetch()
  .then(function(talent) {
    if (talent) {
      talent.destroy();
      return callback(true)
    } else {
      return callback(false);
    }
  });
};

module.exports = Talent;