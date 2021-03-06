var db = require('../config/db');
var Talent = require('../config/schema').Talent;

// Get all talent from the database
var filetTalentByByAge = function (filterArrayInput) {
  var addTalenAges = '';
  for (var i in filterArrayInput['age']) {
    if (filterArrayInput['age'][i] === 'Less than 20') {
      addTalenAges = ' AND t.age < 20';
    }
    if (filterArrayInput['age'][i] === '20-30') {
      if (addTalenAges == '')
        addTalenAges = addTalenAges + ' AND t.age BETWEEN 20 AND 30';
      else
        addTalenAges = addTalenAges + ' OR t.age BETWEEN 20 AND 30';
    }
    if (filterArrayInput['age'][i] === '30-40') {
      if (addTalenAges == '')
        addTalenAges = addTalenAges + ' AND t.age BETWEEN 30 AND 40';
      else
        addTalenAges = addTalenAges + ' OR t.age BETWEEN 30 AND 40';
    }
    if (filterArrayInput['age'][i] === '40-50') {
      if (addTalenAges == '')
        addTalenAges = addTalenAges + ' AND t.age BETWEEN 40 AND 50';
      else
        addTalenAges = addTalenAges + ' OR t.age BETWEEN 40 AND 50';
    }
    if (filterArrayInput['age'][i] === 'over 50') {
      if (addTalenAges == '')
        addAges = addTalenAges + ' AND t.age > 50';
      else
        addTalenAges = addTalenAges + ' OR t.age > 50';
    }
  }
  return addTalenAges;
};



Talent.getRowCout = function (callback) {
  db.knex.raw(' \
    SELECT count(t.id) as rowCount from talent t').then(function (results) {
    var data = results[0];
    callback(data);
  });
};

Talent.getAll = function (pageNumber, pageSize, filterArrayInput, arrayLenVal, callback) {
  var arrayLenVal = parseInt(arrayLenVal);
  var applyWhereFilter = '';
  var offSetLimitValueStr = '';
  var filterTalentName = '';
  var filterDeletedRows = '';
  if (!arrayLenVal) {
    var pageNumber = parseInt(pageNumber);
    var pageSize = parseInt(pageSize);
    var reducedValue = parseInt(pageSize - 1);
    var limitValue = pageNumber * pageSize - reducedValue;
    filterDeletedRows = ' WHERE t.deleted = 0';
    offSetLimitValueStr = ' LIMIT ' + limitValue + ', ' + pageSize;
  } else {
    var addgender = '';
    var addName = "'%" + "%'";
    var addRoles = '';
    var addGenres = '';
    var addAges = '';
    var addCountry = '';
    var addCreatedby = '';
    var addcreatedbycomments = "'%" + "%'";
    var addCountry = '';
    var addEthnicity = '';
    var addBudget = '';
    var addIncome = '';
    var addRatio = '';

    if (filterArrayInput['createdbycomments'].length) {
      addcreatedbycomments = "'%" + filterArrayInput['createdbycomments'][0] +  "%'";
    }
    
    if (filterArrayInput['nameVal'].length) {
      addName = "'%" + filterArrayInput['nameVal'][0] + "%'";
    }

    if (filterArrayInput['gender'].length) {
      for (var i in filterArrayInput['gender']) {
        addgender += "'" + filterArrayInput['gender'][i] + "'" + ",";
      }
      addgender = addgender.replace(/,\s*$/, "");
    }

    if (filterArrayInput['role'].length) {
      for (var i in filterArrayInput['role']) {
        addRoles += "'" + filterArrayInput['role'][i] + "'" + ",";
      }
      addRoles = addRoles.replace(/,\s*$/, "");
    }
    if (filterArrayInput['genres'].length) {
      for (var i in filterArrayInput['genres']) {
        addGenres += "'" + filterArrayInput['genres'][i] + "'" + ",";
      }
      addGenres = addGenres.replace(/,\s*$/, "");
    }

    if (filterArrayInput['createdby'].length) {
      for (var i in filterArrayInput['createdby']) {
        addCreatedby += "'" + filterArrayInput['createdby'][i] + "'" + ",";
      }
      addCreatedby = addCreatedby.replace(/,\s*$/, "");
    }

    if (filterArrayInput['EthnicityID'].length) {
      for (var i in filterArrayInput['EthnicityID']) {
        addEthnicity += filterArrayInput['EthnicityID'][i] + ",";
      }
      addEthnicity = addEthnicity.replace(/,\s*$/, "");
    }

    if (filterArrayInput['country'].length) {
      for (var i in filterArrayInput['country']) {
        addCountry += "'" + filterArrayInput['country'][i] + "'" + ",";
      }
      addCountry = addCountry.replace(/,\s*$/, "");
    }
    if (filterArrayInput['age'].length) {
      addAges = filetTalentByByAge(filterArrayInput);
    }
    //CONCAT(COALESCE(t.first_name,\'\'),\' \',COALESCE(t.last_name,\'\')) AS name,
        applyWhereFilter = ' WHERE CONCAT(COALESCE(t.first_name,\'\'),\' \',COALESCE(t.last_name,\'\')) LIKE ' + addName + ' and t.createdbycomments LIKE '+ addcreatedbycomments;
    if (addRoles !== '' || addGenres != '') {
      applyWhereFilter = ', credit_talent_role_join cjoin1';
      if (addRoles !== '') {
        applyWhereFilter = applyWhereFilter + ' inner join roles r1 on r1.id = cjoin1.role_id';
      }
      if (addGenres != '') {
        applyWhereFilter = applyWhereFilter + ' inner join credits_genres_join cgj on cgj.credit_id = cjoin1.credit_id inner join genres g on g.id = cgj.genre_id';
      }
      applyWhereFilter = applyWhereFilter + ' WHERE cjoin1.talent_id = t.id';
      if (filterArrayInput['nameVal'].length) {
        applyWhereFilter = applyWhereFilter + ' AND CONCAT(COALESCE(t.first_name,\'\'),\' \',COALESCE(t.last_name,\'\')) LIKE ' + addName;
      }
      console.log(filterArrayInput['createdbycomments'].length);
      if (filterArrayInput['createdbycomments'].length) {
        applyWhereFilter = applyWhereFilter + ' AND t.createdbycomments LIKE '+ addcreatedbycomments;
      }
    }
    if (addRoles !== '') {
      applyWhereFilter = applyWhereFilter + ' AND r1.name in (' + addRoles + ')';
    }
    if (addgender !== '') {
      applyWhereFilter = applyWhereFilter + ' AND t.gender in (' + addgender + ')';
    }
    if (addCreatedby !== '') {
      applyWhereFilter = applyWhereFilter + ' AND t.createdby in (' + addCreatedby + ')';
    }
    if (addCountry !== '') {
      applyWhereFilter = applyWhereFilter + ' AND t.country in (' + addCountry + ')';
    }
    if (addGenres !== '') {
      applyWhereFilter = applyWhereFilter + ' AND g.name in (' + addGenres + ')';
    }

    if (addEthnicity !== '') {
      applyWhereFilter = applyWhereFilter + ' AND t.ethnicity_id in (' + addEthnicity + ')';
    }
    if (addAges !== '') {
      applyWhereFilter = applyWhereFilter + addAges;
    }
    if(applyWhereFilter!=''){
      applyWhereFilter = applyWhereFilter+' AND t.deleted = 0'; 
    }else{
      applyWhereFilter = ' WHERE t.deleted = 0';
    }
    //console.log("hiiiiiiiii");
    //console.log(applyWhereFilter);

    offSetLimitValueStr = '';
    filterDeletedRows = '';
  }//CONCAT(COALESCE(t.first_name,\'\'),\' \',COALESCE(t.last_name,\'\')) AS name
  db.knex.raw(' \
    SELECT \
    DISTINCT(t.id) as id, \
    CONCAT(COALESCE(t.last_name,\'\'),\', \',COALESCE(t.first_name,\'\')) AS name, \
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
  FROM talent t '+ filterDeletedRows + applyWhereFilter +' order by name asc '+ offSetLimitValueStr)
    .then(function (results) {
      var data = results[0];
      callback(data);
    });
};

Talent.insertExcelData = function (data) {
  if (data && data.length > 0) {
    var firstItem = data[0];
  }
};

Talent.getProfile = function (talentId, callback) {
  db.knex.raw(' \
    SELECT t.id as id, t.first_name as firstName, t.last_name as lastName, \
    t.age as age,t.partner as partner, t.gender as gender, t.twitter_url as twitterurl, \
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
    where cjoin.talent_id =' + talentId + ') as credits \
FROM talent t where t.id= ' + talentId)
    .then(function (results) {
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
        .then(function (results1) {
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
               where tacj.talent_id=' + talentId + ' group by a.awardname, release_date, a.awardtype, a.awardfor , c.name')
            .then(function (results2) {
              ob.awards = results2[0];
              //callback(ob);
              db.knex.raw('select c.`name` as creditname,DATE_FORMAT(c.release_date,"%Y") as release_date, GROUP_CONCAT(r.`name` SEPARATOR \'\, \') as rolename,c.estimatedBudget,c.box_office_income,c.logline  from credit_talent_role_join cjoin  inner join credits c on c.id = cjoin.credit_id  inner join roles r on r.id = cjoin.role_id   where cjoin.talent_id =' + talentId + ' GROUP BY creditname')
                .then(function (results3) {
                  ob.credits = results3[0];
                  db.knex.raw('select `at`.type,at.id as atypeid,a.id as asdid, a.firstName,a.lastName,a.email,a.phone, c.`name` as companyname from associate_talent_associate_type_join atj inner join associate_types at ON atj.associte_types_id=`at`.id inner join associate a ON a.id=atj.associate_id inner join company c on c.id=a.company_id where atj.talent_id = ' + talentId)
                    .then(function (results4) {
                      ob.associateInfo = results4[0];
                      callback(ob);
                    });

                });

            });
        });
    });

};

Talent.removeTalentAgentJoin = function(talentId,associateId,associateTypeId, callback){
  db.knex.raw(' \
    DELETE \
    FROM associate_talent_associate_type_join \
    WHERE talent_id='+talentId+' AND associte_types_id='+associateTypeId+' AND associate_id='+associateId)
    .then(function (results) {
      callback(results[0]);
    });
};
// Return list of all talent names
//
Talent.getNames = function (nameChars, callback) {
  var findNameWith = "'" + "%" + nameChars + "%" + "'";
  db.knex.raw(' \
    SELECT \
      talent.id AS id, \
      CONCAT(COALESCE(talent.first_name,\'\'),\' \',COALESCE(talent.last_name,\'\')) AS name, \
      talent.last_name AS last_name \
    FROM talent \
    WHERE CONCAT(COALESCE(talent.first_name,\'\'),\' \',COALESCE(talent.last_name,\'\')) like ' + findNameWith + ' and talent.deleted = false LIMIT 10')
    .then(function (results) {
      callback(results[0]);
    });
};

// Return list of all agent details
Talent.getAgentDetails = function (CheckType,callback) {
  var applyAgentType = "";
  if(CheckType!=-1){
    applyAgentType = " WHERE at.id="+CheckType;
  }
  db.knex.raw(' \
    select distinct a.id as asdid,`at`.type,at.id as atypeid, \
    CONCAT(a.firstName, \' \', a.lastName) AS name,a.email as email,a.phone as phone, \
    c.`id` as companyid,c.`name` as companyname \
    from associate_talent_associate_type_join atj \
    inner join associate_types at ON atj.associte_types_id=`at`.id \
    inner join associate a ON a.id=atj.associate_id inner join \
    company c on c.id=a.company_id'+applyAgentType+' group by c.`id`')
    .then(function (results) {
      callback(results[0]);
    });
};

Talent.getAgentDetailsById = function(idDataList,callback){
  db.knex.raw(' \
    select `at`.type,at.id as atypeid,a.id as asdid, \
    CONCAT(a.firstName, \' \', a.lastName) AS name,a.email as email,a.phone as phone, \
    c.`id` as companyid,c.`name` as companyname \
    from associate_talent_associate_type_join atj \
    inner join associate_types at ON atj.associte_types_id=`at`.id \
    inner join associate a ON a.id=atj.associate_id inner join \
    company c on c.id=a.company_id where atj.talent_id='+idDataList['talentID']+' and atj.associte_types_id='+idDataList['agentTypeid']+' and atj.associate_id='+idDataList['agentID'])
    .then(function (results) {
      callback(results[0]);
    });

};

// Return list of all agent details
Talent.addNewTalentAgentJoin = function (isNewrow,dataList,callback) {
  //var updateType = "";
  var newCmpnyIdVal = '';
  var newAgentId = '';
  if(dataList['agentTypeIDVal']!==null){
    dataList['agentTypeid'] = dataList['agentTypeIDVal'];
  }
  var addParams = dataList['talentId']+','+dataList['agentTypeid']+','+dataList['agentNameid'];

  if(isNewrow){
    if(isNaN(dataList['cmpnyId']) && isNaN(dataList['agentNameid'])){
      db.knex.raw(' \
        INSERT INTO company(name) \
        values('+'"'+dataList['cmpnyId']+'"'+')')
        .then(function (results) {
          newCmpnyIdVal = results[0].insertId;
          db.knex.raw(' \
            INSERT INTO  associate (firstName,lastName,phone,company_id,types,email) \
            values ('+'"'+dataList['agentNameid']+'"'+','+'null'+','+'"'+dataList['agentPhone']+'"'+','+newCmpnyIdVal+','+dataList['agentTypeid']+','+'"'+dataList['agentEmail']+'"'+')')
            .then(function (results) {
              newAgentId = results[0].insertId;
              db.knex.raw(' \
                INSERT INTO  associate_talent_associate_type_join \
                (talent_id,associte_types_id,associate_id) \
                VALUES ('+dataList['talentId']+','+dataList['agentTypeid']+','+newAgentId+')')
              .then(function (results) {
                return callback({
                  status: 'success',
                  text: "Adding name."
                });
              });
            });
          });
    }else if(isNaN(dataList['cmpnyId']) && !isNaN(dataList['agentNameid'])){
      db.knex.raw(' \
        INSERT INTO company(name) \
        values('+'"'+dataList['cmpnyId']+'"'+')')
        .then(function (results) {
          newCmpnyIdVal = results[0].insertId;
          db.knex.raw(' \
            UPDATE associate SET email='+'"'+dataList['agentEmail']+'"'+',company_id='+newCmpnyIdVal+',phone='+'"'+dataList['agentPhone']+'"'+' WHERE id='+dataList['agentNameid'])
            .then(function (results) {
              newAgentId = results[0].insertId;
              db.knex.raw(' \
                INSERT INTO  associate_talent_associate_type_join \
                (talent_id,associte_types_id,associate_id) \
                VALUES ('+dataList['talentId']+','+dataList['agentTypeid']+','+dataList['agentNameid']+')')
              .then(function (results) {
                return callback({
                  status: 'success',
                  text: "Adding name."
                });
              });
            });
          });
    }
    else if(!isNaN(dataList['cmpnyId']) && isNaN(dataList['agentNameid'])){
          db.knex.raw(' \
            INSERT INTO  associate (firstName,lastName,phone,company_id,types,email) \
            values ('+'"'+dataList['agentNameid']+'"'+','+'null'+','+'"'+dataList['agentPhone']+'"'+','+dataList['cmpnyId']+','+dataList['agentTypeid']+','+'"'+dataList['agentEmail']+'"'+')')
            .then(function (results) {
              newAgentId = results[0].insertId;
              db.knex.raw(' \
                INSERT INTO  associate_talent_associate_type_join \
                (talent_id,associte_types_id,associate_id) \
                VALUES ('+dataList['talentId']+','+dataList['agentTypeid']+','+newAgentId+')')
              .then(function (results) {
                return callback({
                  status: 'success',
                  text: "Adding name."
                });
              });
            });
    }
  }else{
     db.knex.raw(' \
      UPDATE associate SET email='+'"'+dataList['agentEmail']+'"'+',company_id='+dataList['cmpnyId']+',phone='+'"'+dataList['agentPhone']+'"'+' WHERE id='+dataList['agentNameid'])
      .then(function (results) {
        db.knex.raw(' \
          SELECT count(*) as rowNum FROM associate_talent_associate_type_join \
          where talent_id = '+dataList['talentId']+' \
          and associte_types_id ='+dataList['agentTypeid']+' \
          and associate_id='+dataList['agentNameid'])
        .then(function (results) {
          if(!results[0][0].rowNum){
              db.knex.raw(' \
                INSERT INTO  associate_talent_associate_type_join \
                (talent_id,associte_types_id,associate_id) \
                VALUES ('+addParams+')')
              .then(function (results) {
                return callback({
                  status: 'success',
                  text: "Adding name."
                });
              });
          }else{
            return callback({
              status: 'error',
              text: "Agent with the same name already exist."
            });
          }
        });
      });
  }
  
};

Talent.updateAgentRowDetails = function(dataRowList,callback){
  db.knex.raw(' \
    UPDATE associate SET email='+'"'+dataRowList['email_id']+'"'+',company_id='+dataRowList['companynameIdVal']+',phone='+'"'+dataRowList['phone_num']+'"'+' WHERE id='+dataRowList['agent_id'])
  .then(function (results) {
      return callback({
                  status: 'success',
                  text: "Successfully updated Agent record."
          });
  });
};

// Return list of all createdby names
Talent.getAllCreatedByname = function (callback) {
  db.knex.raw(' \
    SELECT distinct(createdby) as createdby \
      FROM talent \
    WHERE createdby is not null order by createdby')
    .then(function (results) {
      callback(results[0]);
    });
};

// Return list of all awards names
Talent.allAwards = function (callback) {
  db.knex.raw(' \
    SELECT distinct(awardname) as awardname \
      FROM awards \
    WHERE awardname is not null order by awardname')
    .then(function (results) {
      callback(results[0]);
    });
};

// Return list of all country names
Talent.getAllCountryNames = function (callback) {
  db.knex.raw(' \
    SELECT distinct(country) as country \
      FROM talent \
    WHERE country is not null order by country')
    .then(function (results) {
      callback(results[0]);
    });
};

//CONCAT(COALESCE(talent.first_name,''),\' \',COALESCE(talent.last_name,'') AS name
Talent.getName = function (id, callback) {
  db.knex.raw(' \
    SELECT \
    CONCAT(COALESCE(talent.first_name,\'\'),\' \',COALESCE(talent.last_name,\'\')) AS name \
    FROM talent \
    WHERE talent.id = ' + id)
    .then(function (results) {
      callback(results[0][0].name);
    });
}

Talent.talentPartnerName = function (talentId, partnerName, callback) {
  var partnerName = "'" + partnerName + "'";
  db.knex.raw('UPDATE talent SET partner=' + partnerName + ' WHERE id=' + talentId)
    .then(function (results) {
      callback(null, {
        status: 'edit',
        text: 'Successfully edited '
      });
    });
}

Talent.get = function (id, callback) {
  db.knex.raw(' \
    SELECT \
      id AS id, \
      first_name, \
      last_name, \
      email, \
      phone, \
      age, \
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
    .then(function (results) {
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
        .then(function (results) {
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
            .then(function (results) {
              data.talentCreditJoins = results[0];
              db.knex.raw('\
     SELECT \
         CONCAT(users.first_name, \' \', users.last_name) AS creator_name \
       FROM  talent, users \
     WHERE talent.id = ' + data.id.toString() + ' AND users.id = talent.created_by')
                .then(function (results) {
                  callback(data);
                });
            });
        });
    });
};


Talent.addOrEdit = function (talentData, callback) {
  // Check to see if talent exists with same name
  new Talent({
      first_name: talentData.first_name,
      last_name: talentData.last_name
    })
    .fetch()
    .then(function (talent) {
      // If talent exists
      if (talent) {
        // If the email matches, then edit the data
        if (talent.get('email') === talentData.email || talent.get('id') === talentData.id) {
          for (var key in talentData) {
            if (key !== "created_at" && key !== "createdby" && key !== "createdbycomments") {
              talent.set(key, talentData[key]);
              talent.save();
            }

          }
          talent.save()
            .then(function () {
              Talent.matchPartner(talent.get('id'), talent.get('partner_id'));
              Talent.getName(talent.get('id'), function (name) {
                callback(null, {
                  status: 'edit',
                  text: 'Successfully edited ' + name,
                  id: talent.get('id'),
                  name: name
                });
              });
            })
        } else {
          // Given name already exists with different email
          if(talent.get('deleted') && talent.get('deleted') === 1){
        	  return callback({
                  status: 'error',
                  option:'undelete',
                  id:talent.get('id'),
                  text: "Talent with same name already exists, but has been deleted."
                });
          }else{
        	  return callback({
                  status: 'error',
                  option:'',
                  id:'',
                  text: "Talent with same name already exists"
                });
          }
        }
        // If talent with given name doesn't exist
      } else {
        // Check to see if talent exists with given email
        if (!!talentData.email) {
          new Talent({
              email: talentData.email
            })
            .fetch()
            .then(function (talent) {
              // If talent with given email exists, return error
              if (talent) {
                if (talent.get('id') === talentData.id) {
                  for (var key in talentData) {
                    talent.set(key, talentData[key]);
                    talent.save();
                  }
                  talent.save()
                    .then(function () {
                      Talent.matchPartner(talent.get('id'), talent.get('partner_id'));
                      Talent.getName(talent.get('id'), function (name) {
                        callback(null, {
                          status: 'edit',
                          text: 'Successfully edited ' + name,
                          id: talent.get('id'),
                          name: name
                        });
                      });
                    });
                } else {
                	if(talent.get('deleted') && talent.get('deleted') === 1){
                  	  return callback({
                            status: 'error',
                            option:'undelete',
                            id:talent.get('id'),
                            text: "Talent with same email already exists, but has been deleted."
                          });
                    }else{
                  	  return callback({
                            status: 'error',
                            option:'',
                            id:'',
                            text: "Talent with same email already exists"
                          });
                    }
                }
              } else {
                // Otherwise create new talent
                new Talent(talentData)
                  .save()
                  .then(function (talent) {
                    Talent.matchPartner(talent.get('id'), talent.get('partner_id'));
                    Talent.getName(talent.get('id'), function (name) {
                    if (typeof talentData.id == 'undefined'){
                        callback(null, {
                          status: 'add',
                          text: 'Added new talent ' + name,
                          id: talent.get('id'),
                          name: name
                        });
                    }
                    else{
                        callback(null, {
                        status: 'edit',
                        text: 'Successfully edited ' + name,
                        id: talent.get('id'),
                        name: name
                        });
                      }
                    });
                  });
              }
            });
          // Otherwise, if email does not exist and it is null, create new talent
        } else {
          new Talent(talentData)
            .save()
            .then(function (talent) {
              Talent.matchPartner(talent.get('id'), talent.get('partner_id'));
              Talent.getName(talent.get('id'), function (name) {
              if (typeof talentData.id == 'undefined'){
                callback(null, {
                  status: 'add',
                  text: 'Added new talent ' + name,
                  id: talent.get('id'),
                  name: name
                });
              }
              else{
                callback(null, {
                  status: 'edit',
                  text: 'Successfully edited ' + name,
                  id: talent.get('id'),
                  name: name
                });
              }
              });
            });
        }
      }
    })
};

// If parter
Talent.matchPartner = function (partnerId1, partnerId2) {
  if (!!partnerId2) {
    console.log("partner id exists")
    new Talent({
        id: partnerId2
      })
      .fetch()
      .then(function (talent) {
        if (!talent.get('partner_id')) {
          console.log('talent doesnt have partner id');
          talent.set('partner_id', partnerId1)
          talent.save();
        }
      });
  }
};

Talent.getUndelete = function(talentId, callback){
	
	new Talent({
	      id: talentId
	    })
	    .fetch()
	    .then(function (talent) {
	    	if(talent){
	    		db.knex.raw(' \
				UPDATE \
				talent set deleted = 0 \
				WHERE id='+talentId)
				.then(function (results) {
				  callback(talent);
				});
	    	}else{
	    		return callback(false);
	    	}
	    });
};

Talent.remove = function (data, callback) {
  new Talent({
      id: data.talentId
    })
    .fetch()
    .then(function (talent) {
      if (talent) {
        talent.set('deleted', true);
        talent.set('deleted_by', data.userId);
        talent.set('deleted_at', data.deletedAt);
        talent.save()
          .then(function () {
            return callback(true)
          });
      } else {
        return callback(false);
      }
    });
};

module.exports = Talent;