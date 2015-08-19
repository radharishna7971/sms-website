  require('./config');

  var knex = require('knex')({
    client: 'mysql',
    connection: process.env.CLEARDB_DATABASE_URL || {
      host: process.env.DB_HOSTNAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      charset: 'utf8'
    }
  });

  module.exports = require('bookshelf')(knex);