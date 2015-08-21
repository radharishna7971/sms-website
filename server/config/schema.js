var db = require('./db');

db.knex.schema.hasTable('email_list').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('email_list', function(email) {
      email.increments('id').primary();
      email.string('email', 50);
      email.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Email List Table');
    });
  }
});

db.knex.schema.hasTable('roles').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('roles', function(role) {
      role.increments('id').primary();
      role.string('name', 30);
      role.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Roles Table');
    });
  }
});

db.knex.schema.hasTable('genres').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('genres', function(genre) {
      genre.increments('id').primary();
      genre.string('name', 30);
      genre.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Genres Table');
    });
  }
});

db.knex.schema.hasTable('contacts').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('contacts', function(contact) {
      contact.increments('id').primary();
      contact.string('first_name', 50);
      contact.string('last_name', 50);
      contact.string('email', 50);
      contact.string('phone', 20);
      contact.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Contacts Table');
    });
  }
});

db.knex.schema.hasTable('actors').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('actors', function(actor) {
      actor.increments('id').primary();
      actor.string('first_name', 50);
      actor.string('last_name', 50);
      actor.string('email', 50);
      actor.string('phone', 20);
      actor.integer('primary_role_id', 50).unsigned().references('roles.id');
      actor.integer('secondary_role_id', 50).unsigned().references('roles.id');
      actor.integer('primary_genre_id', 50).unsigned().references('genres.id');
      actor.integer('secondary_genre_id', 50).unsigned().references('genres.id');
      actor.string('imdb_url', 100);
      actor.integer('manager_id').unsigned().references('contacts.id');
      actor.integer('agent_id').unsigned().references('contacts.id');
      actor.integer('partner_id').unsigned().references('contacts.id');
      actor.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Actors Table');
    });
  }
});

db.knex.schema.hasTable('films').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('films', function(film) {
      film.increments('id').primary();
      film.string('name', 75);
      film.date('release_date');
      film.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Films Table');
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function(user) {
      user.increments('id').primary();
      user.string('first_name', 75);
      user.string('last_name', 75);
      user.string('email', 75);
      user.string('password', 75);
      user.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Users Table');
    });
  }
});

db.knex.schema.hasTable('comments').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('comments', function(comment) {
      comment.increments('id').primary();
      comment.integer('user_id').unsigned().references('users.id');
      comment.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Comments Table');
    });
  }
});

db.knex.schema.hasTable('actor_film_join').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('actor_film_join', function(join) {
      join.increments('id').primary();
      join.integer('actor_id').unsigned().references('actors.id');
      join.integer('film_id').unsigned().references('films.id');
      join.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Actor Film Join Table');
    });
  }
});




var EmailListEntry = exports.EmailListEntry = db.Model.extend({
  tableName: 'email_list'
});

var Role = exports.Role = db.Model.extend({
  tableName: 'roles',
  actor: function() {
    return this.hasMany(Actor);
  }
});

var Contact = exports.Contact = db.Model.extend({
  tableName: 'contacts',
  actors: function() {
    return this.hasMany(Actor);
  }
});

var Actor = exports.Actor = db.Model.extend({
  tableName: 'actors',
  primary_role_id: function() {
    return this.belongsTo(Role, 'primary_role_id');
  },
  secondary_role_id: function() {
    return this.belongsTo(Role, 'secondary_role_id');
  },
  primary_genre_id: function() {
    this.belongsTo(Genre, 'primary_genre_id');
  },
  secondary_genre_id: function() {
    this.belongsTo(Genre, 'secondary_genre_id');
  },
  manager_id: function(){
    this.belongsTo(Contact, 'manager_id');
  },
  agent_id: function() {
    this.belongsTo(Contact, 'agent_id');
  },
  partner_id: function() {
    this.belongsTo(Contact, 'partner_id');
  },
  actorFilmJoin: function() {
    this.hasMany(ActorFilmJoin);
  }
});

var Genre = exports.Genre = db.Model.extend({
  tableName: 'genres',
  actor: function() {
    return this.hasMany(Actor);
  }
});

var Film = exports.Film = db.Model.extend({
  tableName: 'films',
  actorFilmJoin: function() {
    this.hasMany(ActorFilmJoin);
  }
});

var User = exports.User = db.Model.extend({
  tableName: 'users',
  comments: function() {
    return this.hasMany(Comment);
  }
});

var Comment = exports.Comment = db.Model.extend({
  tableName: 'comments',
  user: function() {
    return this.belongsTo(User, 'user_id');
  }
});


var ActorFilmJoin = exports.ActorFilmJoin = db.Model.extend({
  tablename: 'actor_film_join',
  actor: function() {
    this.belongsTo(Actor, 'actor_id');
  },
  film: function() {
    this.belongsTo(Film, 'film_id');
  }
});



// db.knex.schema.hasTable('secondary_role_join').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('secondary_role_join', function(join) {
//       join.increments('id').primary();
//       join.integer('actor_id').unsigned().references('actors.id');
//       join.integer('role_id').unsigned().references('roles.id');
//       join.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
//     }).then(function(table) {
//       console.log('Created Secondary Roles Join Table');
//     });
//   }
// });

// db.knex.schema.hasTable('secondary_genre_join').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('secondary_genre_join', function(join) {
//       join.increments('id').primary();
//       join.integer('actor_id').unsigned().references('actors.id');
//       join.integer('genre_id').unsigned().references('genres.id');
//       join.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
//     }).then(function(table) {
//       console.log('Created Secondary Genres Join Table');
//     });
//   }
// });

// var SecondaryRoleJoin = exports.SecondaryRoleJoin = db.Model.extend({
//   tablename: 'secondary_role_join',
//   actor: function() {
//     this.belongsTo(Actor, 'actor_id');
//   },
//   role: function() {
//     this.belongsTo(Role, 'role_id');
//   }
// });

// var SecondaryGenreJoin = exports.SecondaryGenreJoin = db.Model.extend({
//   tablename: 'secondary_genre_join',
//   actor: function() {
//     this.belongsTo(Actor, 'actor_id');
//   },
//   genre: function() {
//     this.belongsTo(Genre, 'genre_id');
//   }
// });
