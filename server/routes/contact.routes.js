 var contact = require('../controllers/contact.controller.js');
 module.exports = function(app) {

  app.get('/api/contact/all/names', contact.getNames);
  app.get('/api/contact/', contact.getContact);
  app.post('/api/contact/add-edit', contact.addOrEdit);
  app.delete('/api/contact/delete', contact.remove);

 };