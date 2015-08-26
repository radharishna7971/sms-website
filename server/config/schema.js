var db = require('./db');

// Schema construction
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

db.knex.schema.hasTable('talent').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('talent', function(talent) {
      talent.increments('id').primary();
      talent.string('gender', 50);
      talent.string('location', 50);
      talent.integer('primary_role_id', 50).unsigned().references('roles.id');
      talent.integer('secondary_role_id', 50).unsigned().references('roles.id');
      talent.integer('primary_genre_id', 50).unsigned().references('genres.id');
      talent.integer('secondary_genre_id', 50).unsigned().references('genres.id');
      talent.string('imdb_url', 100);
      talent.string('linkedin_url', 100);
      talent.integer('self_id').unsigned().references('contacts.id');
      talent.integer('manager_id').unsigned().references('contacts.id');
      talent.integer('agent_id').unsigned().references('contacts.id');
      talent.integer('partner_id').unsigned().references('contacts.id');
      talent.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Talent Table');
    });
  }
});

db.knex.schema.hasTable('credits').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('credits', function(credit) {
      credit.increments('id').primary();
      credit.string('name', 75);
      credit.date('release_date');
      credit.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Credits Table');
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
      user.integer('permission');
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
      comment.integer('talent_id').unsigned().references('talent.id');
      comment.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Comments Table');
    });
  }
});

db.knex.schema.hasTable('talent_credit_join').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('talent_credit_join', function(join) {
      join.increments('id').primary();
      join.integer('talent_id').unsigned().references('talent.id');
      join.integer('credit_id').unsigned().references('credits.id');
      join.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Talent Credit Join Table');
    });
  }
});


// Model declaration
var EmailListEntry = exports.EmailListEntry = db.Model.extend({
  tableName: 'email_list'
});

var Role = exports.Role = db.Model.extend({
  tableName: 'roles',
  talent: function() {
    return this.hasMany(Talent);
  }
});

var Contact = exports.Contact = db.Model.extend({
  tableName: 'contacts',
  talent: function() {
    return this.hasMany(Talent);
  }
});

var Talent = exports.Talent = db.Model.extend({
  tableName: 'talent',
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
  self_id: function(){
    this.belongsTo(Contact, 'self_id');
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
  actorCreditJoin: function() {
    this.hasMany(TalentCreditJoin);
  },
  comments: function() {
    this.hasMany(Comment);
  }
});

var Genre = exports.Genre = db.Model.extend({
  tableName: 'genres',
  talent: function() {
    return this.hasMany(Talent);
  }
});

var Credit = exports.Credit = db.Model.extend({
  tableName: 'creditss',
  talentCreditJoin: function() {
    this.hasMany(TalentCreditJoin);
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
  },
  talent: function() {
    return this.belongsTo(Talent, 'talent_id');
  }
});


var TalentCreditJoin = exports.TalentCreditJoin = db.Model.extend({
  tablename: 'talent_credit_join',
  actor: function() {
    this.belongsTo(Actor, 'talent_id');
  },
  credit: function() {
    this.belongsTo(Credit, 'credit_id');
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
