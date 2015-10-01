 var creditType = require('../controllers/creditType.controller.js');
 module.exports = function(app) {

  app.get('/api/credit_type/all/names', creditType.getNames);
  app.post('/api/credit_type/add-edit', creditType.addOrEdit);
  app.delete('/api/credit_type/delete', creditType.remove);
  
 };