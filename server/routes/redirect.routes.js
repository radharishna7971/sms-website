
 module.exports = function(app) {

  app.get('/login', function(req, res) {
    res.redirect('/#/login');
  });
  app.get('/private/home', function(req, res) {
    res.redirect('/#/private/home');
  });
  app.get('/private/users', function(req, res) {
    res.redirect('/#/private/users');
  });
  app.get('/private/talent', function(req, res) {
    res.redirect('/#/private/talent');
  });
  app.get('/private/data-entry', function(req, res) {
    res.redirect('/#/private/data-entry');
  });
 };