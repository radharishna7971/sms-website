 var comment = require('../controllers/comment.controller.js');
 module.exports = function(app) {

  app.post('/api/comment/add', comment.add);
  app.delete('/api/comment/delete', comment.remove);
  
 };