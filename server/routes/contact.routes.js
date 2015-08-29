 var contact = require('../controllers/contact.controller.js');
 module.exports = function(app) {

  app.get('/api/contact/all/names', contact.getNames);
  
 };