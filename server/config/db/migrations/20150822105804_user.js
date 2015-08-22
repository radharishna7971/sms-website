exports.up = function(knex, Promise) {
  return knex.table('users', function(user) {
    user.integer('access').defaultTo(1);
  });
};

exports.down = function(knex, Promise) {
  
};
