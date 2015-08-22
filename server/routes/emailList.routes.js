 var emailList = require('../controllers/emailList.controller.js');

 module.exports = function(app) {

  app.post('/api/email/add', emailList.addEmail);

  app.get('/login', function(req, res) {
    console.log(app.redirect);
    res.redirect('/#/login');
  });
 };