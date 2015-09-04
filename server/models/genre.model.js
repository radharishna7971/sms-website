var db = require('../config/db');
var Genre = require('../config/schema').Genre;

// Return list of all genre names
Genre.getNames = function(callback) {
  db.knex.raw(' \
    SELECT \
      id, \
      name \
    FROM genres')
  .then(function(results) {
     callback(results[0]);
  });
};

// Check to see that name does not already exists.  If it doesn't either edit or add new
Genre.addOrEdit = function(genreData, callback) {
  new Genre({name: genreData.name})
  .fetch()
  .then(function(genre) {
    if (genre) {
      return callback({status: 'error', text: "Genre already exists"});
    } else {
      if (genreData.hasOwnProperty('id')) {
        new Genre({id: genreData.id})
        .fetch()
        .then(function(genre) {
          genre.set('name', genreData.name);
          genre.save();
          callback(null, {status: 'edit', id: genre.get('id'), name: genre.get('name')});
        })
      } else {
        new Genre({name: genreData.name})
        .save()
        .then(function(genre) {
          callback(null, genre);
        });
      }
    }
  });
};

Genre.remove = function(genreId, callback) {
  new Genre({id: genreId})
  .fetch()
  .then(function(genre) {
    if (genre) {
      genre.destroy();
      return callback(true)
    } else {
      return callback(false);
    }
  });
};


module.exports = Genre;