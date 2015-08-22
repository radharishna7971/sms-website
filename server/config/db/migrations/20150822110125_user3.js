exports.up = function(knex, Promise) {
  knex.schema.table('users', function (table) {
    table.integer('access').defaultTo(1);
  });
};

exports.down = function(knex, Promise) {
  
};

