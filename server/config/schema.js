var db = require('./db');

db.knex.schema.hasTable('email_list').then(function(exists) {
  // /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
  // if (exists) {
  //   db.knex.schema.dropTable('email_list').then(function() {
  //     console.log("Removed Users Table");
  //   });
  //   exists = false;
  // }

  /* Create users table if it doesn't exist. */
  if (!exists) {
    db.knex.schema.createTable('email_list', function(user) {
      user.increments('id').primary();
      user.string('email', 30);
      user.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Users Table');
    });
  }
});
