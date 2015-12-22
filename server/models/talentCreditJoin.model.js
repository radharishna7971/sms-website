var db = require('../config/db');
var TalentCreditJoin = require('../config/schema').TalentCreditJoin;

TalentCreditJoin.add = function(talent_id, credit_ids, role_id, callback) {
  // Loop through each credit
  var index = 0;
  (function loop() {
    if (index < credit_ids.length) {
      // For each credit, check to see if a join already exists between the credit and the talent
      new TalentCreditJoin({talent_id: talent_id, credit_id: credit_ids[index]})
      .fetch()
      .then(function(join) {
        // If it does not, create a new join
        if (!join) {
          new TalentCreditJoin({talent_id: talent_id, credit_id: credit_ids[index], role_id: role_id})
          .save()
          .then(function() {
            index++;
            loop();
          });
        // Otherwise move on to next join
        } else {
          index++;
          loop();
        }
      });
    // Once there are no more credits left to check/add, fetch a list of all of the talent's credit-talent-joins
    } else {
      db.knex.raw(' \
       SELECT \
    	credit_talent_role_join.id AS id, \
        credits.name AS credit, \
        credits.release_date AS release_date, \
        roles.name AS role \
       FROM credit_talent_role_join \
       LEFT JOIN talent ON credit_talent_role_join.talent_id = talent.id \
       LEFT JOIN credits ON credit_talent_role_join.credit_id = credits.id \
       LEFT JOIN roles ON credit_talent_role_join.role_id = roles.id \
       WHERE talent.id = ' + talent_id.toString())
      .then(function(results) {
       callback(results[0]);
      });
    }
  }());
};

TalentCreditJoin.remove = function(joinId, callback) {
  var talent_id;
  new TalentCreditJoin({id: joinId})
  .fetch()
  .then(function(join) {
    talent_id = join.get('talent_id');
    join.destroy()
    .then(function() {
      db.knex.raw(' \
        SELECT \
    	credit_talent_role_join.id AS id, \
         credits.name AS credit, \
         credits.release_date AS release_date, \
         roles.name AS role \
        FROM credit_talent_role_join \
        LEFT JOIN talent ON credit_talent_role_join.talent_id = talent.id \
        LEFT JOIN credits ON credit_talent_role_join.credit_id = credits.id \
        LEFT JOIN roles ON credit_talent_role_join.role_id = roles.id \
        WHERE talent.id = ' + talent_id.toString())
      .then(function(results) {
       callback(results[0]);
      });
    });
  });
};

module.exports = TalentCreditJoin;