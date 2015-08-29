 var role = require('../controllers/role.controller.js');
 module.exports = function(app) {

  app.get('/api/role/all/names', role.getNames);
  app.post('/api/role/add-edit', role.addOrEdit);
  
 };