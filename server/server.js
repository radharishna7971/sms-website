  /* Sets the NODE_ENV variable equal to development if it is otherwise undefined.  In a production environment, NODE_ENV will be assigned a value from our host */
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  var express = require('./config/express');
  var app = express();


  //host established for proxy
  var host = process.env.HOSTNAME || null;

  //app.listen(process.env.PORT, host);
  app.listen(80, host);
  module.exports = app;
  console.log('Server running at port: ' + 80);