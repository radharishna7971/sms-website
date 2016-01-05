var db = require('../config/db');
var Talent = require('../config/schema').Talent;

// Get all talent from the database
Talent.getAll = function(callback) {
  db.knex.raw(' \
    SELECT \
    t.id as id, \
    CONCAT(t.last_name, \', \', t.first_name) AS name, \
    t.age as age, \
    t.gender as gender, \
    t.country as country , \
    t.createdby as createdby, \
    ( select e.name from ethnicity e where e.id=t.ethnicity_id ) as ethnicity, \
    (select   GROUP_CONCAT(distinct r.name SEPARATOR \', \') from credit_talent_role_join cjoin \
    inner join roles r on r.id = cjoin.role_id \
    where cjoin.talent_id = t.id) as roles, \
    (select   GROUP_CONCAT(distinct a.awardname SEPARATOR \', \') from talent_award_credit_join cjoin \
    inner join awards a on a.id = cjoin.award_id \
    where cjoin.talent_id = t.id) as awards, \
    (select GROUP_CONCAT(distinct g.name SEPARATOR \', \') as genresdata from credit_talent_role_join cjoin \
    inner join credits c on c.id = cjoin.credit_id \
    inner join credits_genres_join cgj on cgj.credit_id = cjoin.credit_id \
    inner join genres g on g.id = cgj.genre_id \
    where cjoin.talent_id = t.id) as genres, \
    (select GROUP_CONCAT(distinct c.estimatedBudget SEPARATOR \', \') as estimatedBudgetData from credit_talent_role_join cjoin \
    inner join credits c on c.id = cjoin.credit_id \
    where cjoin.talent_id = t.id) as estimatedBudget, \
    (select GROUP_CONCAT(distinct c.box_office_income SEPARATOR \', \') as boxOfficeIncomeData from credit_talent_role_join cjoin \
    inner join credits c on c.id = cjoin.credit_id \
    where cjoin.talent_id = t.id) as boxOfficeIncome, \
    (select GROUP_CONCAT(distinct c.boxbudgetratio SEPARATOR \', \') as boxbudgetratioData from credit_talent_role_join cjoin \
    inner join credits c on c.id = cjoin.credit_id \
    inner join credits_genres_join cgj on cgj.credit_id = cjoin.credit_id \
    inner join genres g on g.id = cgj.genre_id \
    where cjoin.talent_id = t.id) as boxbudgetratio \
  FROM talent t')
  .then(function(results) {
     var data = results[0];
     callback(data);
  });
};

Talent.insertExcelData = function(data){
  if(data && data.length>0){
    var firstItem = data[0];
  }
};

Talent.getProfile= function(talentId, callback) {
  db.knex.raw(' \
    SELECT t.id as id, t.first_name as firstName, t.last_name as lastName, \
    t.age as age,t.partner, t.gender as gender, t.twitter_url as twitterurl, \
    t.facebook_url as facebookurl, t.youtube_url as youtubeurl, t.instagram_url as instagramurl, \
	DATE_FORMAT(t.created_at,"%d %b %Y") as createdAt, DATE_FORMAT(t.last_edited,"%d %b %Y") as lastEdited, \
	t.modifiedby as modifiedBy, t.createdby as createdBy, \
	t.createdbycomments as createdByComments, t.modifiedbycomments as modifiedByComments, \
    t.vine_url as vineurl, t.email as email,t.phone as phone, t.city as city, \
    t.State as state, t.country as country, \
    (select   GROUP_CONCAT(distinct r.name SEPARATOR \', \') from credit_talent_role_join cjoin \
      inner join roles r on r.id = cjoin.role_id \
      where cjoin.talent_id = t.id) as roles, \
	(select GROUP_CONCAT(tp.first_name, \' \', tp.last_name) from talent tp where t.partner=tp.id) as partnername, \
  (select GROUP_CONCAT(distinct g.name SEPARATOR \', \') as genresdata from credit_talent_role_join cjoin \
    inner join credits c on c.id = cjoin.credit_id \
    inner join credits_genres_join cgj on cgj.credit_id = cjoin.credit_id \
    inner join genres g on g.id = cgj.genre_id \
    where cjoin.talent_id = t.id) as genres, \
  (select GROUP_CONCAT(distinct c.name SEPARATOR \', \') as genresdata \
    from credit_talent_role_join cjoin \
    inner join credits c on c.id = cjoin.credit_id \
    where cjoin.talent_id ='+ talentId+') as credits \
FROM talent t where t.id= ' + talentId)
  .then(function(results) {
	  var ob = {};
	  ob.details = results[0];
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
		       AND talent.id = ' + talentId)
		     .then(function(results1) {
		    	 ob.comments = results1[0];
		    	 
		    	 db.knex.raw(' \
		    			 select a.awardname, DATE_FORMAT(c.release_date,"%Y") as release_date, a.awardtype, \
		    			 c.`name`, a.awardfor \
		    			 from talent_award_credit_join tacj\
		    			 INNER JOIN awards a ON tacj.award_id = a.id \
		    			 INNER JOIN credits c on tacj.credit_id=c.id \
		    			 INNER JOIN talent t on t.id=tacj.talent_id \
               INNER JOIN credit_talent_role_join ctr on  \
               tacj.credit_id= ctr.credit_id and  tacj.talent_id= ctr.talent_id \
		    			 where tacj.talent_id='+talentId +' group by a.awardname, release_date, a.awardtype, a.awardfor , c.name')
		  		       .then(function(results2) {
		  		    	   ob.awards = results2[0];
		  		    	 //callback(ob);
			  		    	 db.knex.raw('select c.`name` as creditname,DATE_FORMAT(c.release_date,"%Y") as release_date, GROUP_CONCAT(r.`name` SEPARATOR \'\, \') as rolename,c.estimatedBudget,c.box_office_income,c.logline  from credit_talent_role_join cjoin  inner join credits c on c.id = cjoin.credit_id  inner join roles r on r.id = cjoin.role_id   where cjoin.talent_id ='+talentId+' GROUP BY creditname') 
							    	.then(function(results3) {
							    		ob.credits = results3[0];
							    		
							    		db.knex.raw('select `at`.type,a.firstName,a.lastName from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id  where atj.talent_id = '+talentId)
							    		.then(function(results4) {
							    			ob.associateInfo = results4[0];
							    			callback(ob);
							    		});
							    		
							    	});
		  		    	   
		  		       });
		     });
  });
  
};

// Return list of all talent names
Talent.getNames = function(nameChars,callback) {
  var findNameWith = "'"+"%"+nameChars+"%"+"'";
  db.knex.raw(' \
    SELECT \
      talent.id AS id, \
      CONCAT(talent.first_name, \' \', talent.last_name) AS name, \
      talent.last_name AS last_name \
    FROM talent \
    WHERE CONCAT(talent.first_name, \' \', talent.last_name) like '+findNameWith+' and talent.deleted = false LIMIT 10')
  .then(function(results) {
     callback(results[0]);
  });
};

// Return list of all createdby names
Talent.getAllCreatedByname = function(callback) {
  db.knex.raw(' \
    SELECT distinct(createdby) as createdby \
      FROM talent \
    WHERE createdby is not null order by createdby')
  .then(function(results) {
     callback(results[0]);
  });
};

// Return list of all awards names
Talent.allAwards = function(callback) {
  db.knex.raw(' \
    SELECT distinct(awardname) as awardname \
      FROM awards \
    WHERE awardname is not null order by awardname')
  .then(function(results) {
     callback(results[0]);
  });
};

// Return list of all country names
Talent.getAllCountryNames = function(callback) {
  db.knex.raw(' \
    SELECT distinct(country) as country \
      FROM talent \
    WHERE country is not null order by country')
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
      city, \
      State, \
      country, \
      createdby, \
      created_at, \
      modifiedby, \
      last_edited, \
      createdbycomments, \
      modifiedbycomments, \
      ethnicity_id, \
      facebook_url, \
      twitter_url, \
      youtube_url, \
      vine_url, \
      instagram_url, \
      partner \
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
      db.knex.raw(' \
       SELECT \
    	credit_talent_role_join.id AS id, \
        credits.name AS credit, \
        DATE_FORMAT(credits.release_date,"%Y") as release_date, \
        roles.name AS role \
       FROM credit_talent_role_join \
       INNER JOIN talent ON credit_talent_role_join.talent_id = talent.id \
       INNER JOIN credits ON credit_talent_role_join.credit_id = credits.id \
       INNER JOIN roles ON credit_talent_role_join.role_id = roles.id \
       WHERE talent.id = ' + data.id.toString())
      .then(function(results) {
       data.talentCreditJoins = results[0];
	   db.knex.raw('\
	   SELECT \
         CONCAT(users.first_name, \' \', users.last_name) AS creator_name \
       FROM  talent, users \
	   WHERE talent.id = ' + data.id.toString() + ' AND users.id = talent.created_by')
	   .then(function(results) {
       callback(data);
	   });
      });
     });
  });
};


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
          if(key !=="created_at" && key !=="createdby" && key !=="createdbycomments"){
             talent.set(key, talentData[key]);
              talent.save();
          }
         
        }
        talent.save()
        .then(function() {
          Talent.matchPartner(talent.get('id'), talent.get('partner_id'));
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
      if (!!talentData.email) {
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
                Talent.matchPartner(talent.get('id'), talent.get('partner_id'));
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
              Talent.matchPartner(talent.get('id'), talent.get('partner_id'));
              Talent.getName(talent.get('id'), function(name) {
               callback(null, {status: 'add', text: 'Added new talent ' + name, id: talent.get('id'), name: name});
              });
            });
          }
        });
      // Otherwise, if email does not exist and it is null, create new talent
      } else {
        new Talent(talentData)
        .save()
        .then(function(talent) {
          Talent.matchPartner(talent.get('id'), talent.get('partner_id'));
          Talent.getName(talent.get('id'), function(name) {
           callback(null, {status: 'add', text: 'Added new talent ' + name, id: talent.get('id'), name: name});
          });
        });
      }
    }
  })
};

// If parter
Talent.matchPartner = function(partnerId1, partnerId2) {
  if (!!partnerId2) {
    console.log("partner id exists")
     new Talent({id: partnerId2})
     .fetch()
     .then(function(talent) {
      console.log(talent);
      if (!talent.get('partner_id')) {
        console.log('talent doesnt have partner id');
        talent.set('partner_id', partnerId1)
        talent.save();
      }
    });
  }
};


Talent.remove = function(data, callback) {
  new Talent({id: data.talentId})
  .fetch()
  .then(function(talent) {
    if (talent) {
      talent.set('deleted', true);
      talent.set('deleted_by', data.userId);
      talent.set('deleted_at', data.deletedAt);
      talent.save()
      .then(function() {
        return callback(true)
      });
    } else {
      return callback(false);
    }
  });
};

module.exports = Talent;