 var talent = require('../controllers/talent.controller.js');
 module.exports = function(app) {

  app.get('/api/talent/all', talent.getAll);
  app.get('/api/talent/all/names', talent.getNames);
  app.get('/api/talent/profile', talent.getProfile);
  app.get('/api/talent', talent.getTalent);
  app.post('/api/talent/add-edit', talent.addOrEdit);
  app.delete('/api/talent/delete', talent.remove);
  
 };