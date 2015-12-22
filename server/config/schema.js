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

db.knex.schema.hasTable('credit_types').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('credit_types', function(genre) {
      genre.increments('id').primary();
      genre.string('name', 30);
      genre.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Credit Types Table');
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
      talent.string('first_name', 50);
      talent.string('last_name', 50);
      talent.string('email', 50);
      talent.string('phone', 50);
      talent.string('gender', 50);
      talent.string('city', 50);
      talent.string('state', 50);
      talent.string('country', 50);
      talent.string('gender', 50);
      talent.string('photo_url', 200);
      talent.string('imdb_url', 100);
      talent.string('linkedin_url', 100);
      talent.string('facebook_url', 100);
      talent.string('youtube_url', 100);
      talent.string('twitter_url', 100);
      talent.string('vine_url', 100);
      talent.string('instagram_url', 100);
      talent.integer('manager_id').unsigned().references('contacts.id');
      talent.integer('agent_id').unsigned().references('contacts.id');
      talent.integer('partner_id').unsigned().references('talent.id');
      talent.integer('created_by').unsigned().references('users.id');
      talent.integer('last_edited_by').unsigned().references('users.id');
      talent.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
      talent.timestamp('last_edited');
      talent.boolean('deleted').defaultTo(false);
      talent.integer('deleted_by').unsigned().references('users.id');
      talent.timestamp('deleted_at');
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
      credit.string('type', 75);
      credit.integer('genre_id').unsigned().references('genres.id');
      credit.integer('credit_type_id').unsigned().references('credit_types.id');
      credit.integer('release_date');
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
      comment.string('text', 1000);
      comment.boolean('deleted').defaultTo(false);
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
      join.integer('role_id').unsigned().references('roles.id');
      join.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Talent Credit Join Table');
    });
  }
});

db.knex.schema.hasTable('ethnicity').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('ethnicity', function(ethnicity) {
      ethnicity.increments('id').primary();
      ethnicity.string('name', 30);
      ethnicity.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
	  ethnicity.timestamp('last_edited');
    }).then(function(table) {
      console.log('Created Ethnicity Table');
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
  },
  talentCreditJoin: function() {
    this.hasMany(TalentCreditJoin);
  }
});

var Contact = exports.Contact = db.Model.extend({
  tableName: 'contacts',
  talent: function() {
    return this.hasMany(Talent);
  }
});

var CreditType = exports.CreditType = db.Model.extend({
  tableName: 'credit_types',
  credit: function() {
    return this.hasMany(Credit);
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
  ethnicity_id: function() {
    this.belongsTo(Ethnicity, 'ethnicity_id');
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
  },
  users: function() {
    this.belongsTo(User);
  }
});

var Genre = exports.Genre = db.Model.extend({
  tableName: 'genres',
  talent: function() {
    return this.hasMany(Talent);
  },
  credit: function() {
    return this.hasMany(Credit);
  }
});

var Credit = exports.Credit = db.Model.extend({
  tableName: 'credits',
  talentCreditJoin: function() {
    this.hasMany(TalentCreditJoin);
  },
  genre: function() {
    this.belongsTo(Genre, 'genre_id');
  },
  creditType: function() {
    this.belongsTo(CreditType, 'credit_type_id');
  }
});

var User = exports.User = db.Model.extend({
  tableName: 'users',
  comments: function() {
    return this.hasMany(Comment);
  },
  talent: function() {
    return this.hasMany(Talent);
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
  tableName: 'credit_talent_role_join',
  talent: function() {
    this.belongsTo(Actor, 'talent_id');
  },
  credit: function() {
    this.belongsTo(Credit, 'credit_id');
  },
  role: function() {
    this.belongsTo(Role, 'role_id');
  }
});

var Ethnicity = exports.Ethnicity = db.Model.extend({
  tableName: 'ethnicity',
  talent: function() {
    return this.hasMany(Talent);
  },
  talentCreditJoin: function() {
    this.hasMany(TalentCreditJoin);
  }
});