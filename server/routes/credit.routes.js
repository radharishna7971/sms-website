 var credit = require('../controllers/credit.controller.js');
 module.exports = function(app) {

  app.get('/api/credit/all/names', credit.getNames);
  app.get('/api/credit/all/namesByChars', credit.namesByChars);
  app.get('/api/credit/credit', credit.getCredit);
  app.post('/api/credit/add-edit', credit.addOrEdit);
  app.delete('/api/credit/delete', credit.remove);
  
 };