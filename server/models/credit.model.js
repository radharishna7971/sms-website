  var db = require('../config/db');
var Credit = require('../config/schema').Credit;
var Genre = require('./genre.model');
var Q = require('q');

// Return list of all credit names
// Also includes the genre and year
Credit.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      credits.id, \
      credits.record_id, \
      credits.name, \
      DATE_FORMAT(credits.release_date,"%Y") as release_date, \
      credits.logline, \
      credits.estimatedBudget, \
      credits.box_office_income \
      FROM credits \
      ')
  .then(function(results) {
     callback(results[0]);
  });
};

//Get credits by user input credits entry
Credit.namesByChars = function(Chars, callback) {
  var findNameWith = "'"+"%"+Chars+"%"+"'"; 
  db.knex.raw(' \
    SELECT \
      credits.id, \
      credits.record_id, \
      credits.name, \
      DATE_FORMAT(credits.release_date,"%Y") as release_date, \
      credits.logline, \
      credits.estimatedBudget, \
      credits.box_office_income \
      FROM credits WHERE name like '+findNameWith+' LIMIT 10')
    .then(function(results) {
     callback(results[0]);
  });
};
  // Convert date format to be SQL-friendly
Credit.get = function(id, callback) {
  db.knex.raw(' \
    SELECT \
      credits.id as id,credits.name as name,credits.record_id as record_id, \
      DATE_FORMAT(credits.release_date,"%Y") as release_date,credits.logline as logline, \
      credits.estimatedBudget as estimatedBudget, \
      credits.box_office_income as box_office_income \
      FROM credits \
      WHERE credits.id = ' + id)
  .then(function(results) {
    var data = results[0][0];
    db.knex.raw(' \
      SELECT cgj.genre_id as id,g.name as name FROM credits_genres_join cgj INNER JOIN genres g ON g.id=cgj.genre_id where cgj.credit_id ='+id)
    .then(function(results) {
      data.genresIds = results[0];
      callback(data);
    });
  });
};

function insertGenreIfNotAvaialble(genre){
  Genre.addOrEdit(req.body, function(err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
}


function createCreditRequest(data){
  var promise = new Credit({
        name: data.Name
      })
      .fetch()
      // .fetch() returns a promise so we call .then()
      .then(function(credit) {
        console.log(credit);
        // If the username is not already in the database...
        if (!credit) {
          // Create a new user with all of the info from userData
           new Credit({
          name: data.Name
        }).save().then(function(response){
          console.log(response);
        }, function(err){
          console.log(err);
        });
        } else {
         
        }
      }, function(err){
        console.log(err);
      });

      return promise;
}

function addUpdateCreditGenre(id,genres){
  var promise = [];
    db.knex.raw(' \
      DELETE FROM credits_genres_join WHERE credit_id='+id)
    .then(function (results) {
      for(var i in genres){
        db.knex.raw(' \
          INSERT INTO  credits_genres_join \
          (credit_id,genre_id) \
          VALUES ('+id+','+genres[i]+')')
        .then(function (results) {
          promise.push(results[0].insertId);
        });
      }
    return promise;
    });
  }

Credit.insertExcelData = function(data,callback){
  //console.log("krishna ....!!!!");
  var promises = [];
  for(var i in data){
      var creditName = data[i].Name;
      var promise = createCreditRequest(data[i]);
      promises.push(promise);
  }
  Q.all(promises).then(function(){
    callback("User already exists.\n"); 
  });
   
};

// Check to see that name does not already exists.  If it doesn't either edit or add new.  If it does exist and the id is the same, edit that credit.
Credit.addOrEdit = function(creditData, getCreditGenre, callback) {
  new Credit({name: creditData.name})
  .fetch()
  .then(function(credit) {
    if (credit) {
      if (credit.get('id') === creditData.id) {
        for (var key in creditData) {
            if(key!='genresIds'){
              credit.set(key, creditData[key]);
            }
          credit.save();
        }
        if(getCreditGenre[0]!=""){
          addUpdateCreditGenre(creditData.id,getCreditGenre);
        }
        callback(null, {status: 'edit', text: 'Successfully edited credit', id: credit.get('id'), name: credit.get('name')});

      } else {
        return callback({status: 'error', text: "Credit already exists"});
      }
    } else {
      if (creditData.hasOwnProperty('id')) {
        new Credit({id: creditData.id})
        .fetch()
        .then(function(credit) {
          for (var key in creditData) {
             if(key!='genresIds'){
              credit.set(key, creditData[key]);
            }
            credit.save();
          }
          credit.save();
          if(getCreditGenre[0]!=""){
            addUpdateCreditGenre(creditData.id,getCreditGenre);
          }
          callback(null, {status: 'edit', text: 'Successfully edited credit', id: credit.get('id'), name: credit.get('name')});
        });
      } else {
        new Credit(creditData)
        .save()
        .then(function(credit) {
          var cid = credit.get('id');
          if(getCreditGenre[0]!=""){
            addUpdateCreditGenre(cid,getCreditGenre);
          }
          callback(null, {status: 'add', text: 'Created new credit', id: credit.get('id'), name: credit.get('name')});
        });
      }
    }
  });
};

Credit.remove = function(creditId, callback) {
  new Credit({id: creditId})
  .fetch()
  .then(function(credit) {
    if (credit) {
      credit.destroy();
      return callback(true)
    } else {
      return callback(false);
    }
  });
};


module.exports = Credit;

