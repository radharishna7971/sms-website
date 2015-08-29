 var credit = require('../controllers/credit.controller.js');
 module.exports = function(app) {

  app.get('/api/credit/all/names', credit.getNames);
  
 };