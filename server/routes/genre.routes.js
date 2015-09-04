 var genre = require('../controllers/genre.controller.js');
 module.exports = function(app) {

  app.get('/api/genre/all/names', genre.getNames);
  app.post('/api/genre/add-edit', genre.addOrEdit);
  app.delete('/api/genre/delete', genre.remove);
  
 };