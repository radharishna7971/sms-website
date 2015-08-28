 var talent = require('../controllers/talent.controller.js');
 module.exports = function(app) {

  app.get('/api/talent/all', talent.getAll);
  app.get('/api/talent/profile', talent.getProfile);
  
 };