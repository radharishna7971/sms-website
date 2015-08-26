 var talent = require('../controllers/talent.controller.js');
 module.exports = function(app) {

  app.post('/api/talent/all', talent.getAll);
  
 };