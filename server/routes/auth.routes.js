 var auth = require('../controllers/auth.controller.js');
 module.exports = function(app) {
  app.post('/api/auth/login', auth.login);
  app.post('/api/auth/create', auth.create);
  app.post('/api/auth/update', auth.update);
  app.post('/api/auth/validate', auth.validate);
  app.post('/api/auth/xlsxFileUpload', auth.xlsxFileUpload);
  app.get('/api/auth/userDetails', auth.getUserDetails);
  app.get('/api/auth/users', auth.getUsers);
  app.get('/api/auth/addRows', auth.addRows);
 };