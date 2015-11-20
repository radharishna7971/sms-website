 var ethnicity = require('../controllers/ethnicity.controller.js');
 module.exports = function(app) {

  app.get('/api/ethnicity/all/names', ethnicity.getNames);
  app.post('/api/ethnicity/add-edit', ethnicity.addOrEdit);
  app.delete('/api/ethnicity/delete', ethnicity.remove);
  
 };