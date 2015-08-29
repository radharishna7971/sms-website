var db = require('../config/db');
var Talent = require('../config/schema').Talent;

// Get all talent from the database
Talent.getAll = function(callback) {
  db.knex.raw(' \
    SELECT \
      self.id AS id, \
      CONCAT(self.first_name, \' \', self.last_name) AS name, \
      role1.name AS primary_role, \
      role2.name AS secondary_role, \
      genre1.name AS primary_genre, \
      genre2.name AS secondary_genre, \
      talent.gender, \
      talent.location \
    FROM talent \
      LEFT JOIN contacts AS self ON talent.self_id = self.id \
      LEFT JOIN roles AS role1 ON talent.primary_role_id = role1.id \
      LEFT JOIN roles AS role2 ON talent.secondary_role_id = role2.id \
      LEFT JOIN genres AS genre1 ON talent.primary_genre_id = genre1.id \
      LEFT JOIN genres AS genre2 ON talent.secondary_genre_id = genre2.id \
  ')
  .then(function(results) {
     var data = results[0];
     callback(data);
  });
};

Talent.getProfile= function(talentId, callback) {
  db.knex.raw(' \
    SELECT \
      self.id AS id, \
      CONCAT(self.first_name, \' \', self.last_name) AS name, \
      self.phone, \
      self.email, \
      role1.name AS primary_role, \
      role2.name AS secondary_role, \
      genre1.name AS primary_genre, \
      genre2.name AS secondary_genre, \
      talent.gender, \
      talent.location, \
      talent.imdb_url, \
      talent.linkedin_url, \
      CONCAT(manager.first_name, \' \', manager.last_name) AS manager, \
      CONCAT(agent.first_name, \' \', agent.last_name) AS agent, \
      CONCAT(partner.first_name, \' \', partner.last_name) AS partner \
    FROM talent \
      LEFT JOIN contacts AS self ON talent.self_id = self.id \
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
        callback(data);
     });
  });
};

// Return list of all talent names
Talent.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      self.id AS id, \
      CONCAT(self.first_name, \' \', self.last_name) AS name \
    FROM talent \
      LEFT JOIN contacts AS self ON talent.self_id = self.id \
  ')
  .then(function(results) {
     callback(results[0]);
  });
}

module.exports = Talent;