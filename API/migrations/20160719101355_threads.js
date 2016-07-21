
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('job')
        .dropTableIfExists('message')
        .dropTableIfExists('user')
        .createTableIfNotExists('user', function(tbl) {
            tbl.increments('id').primary();
            tbl.string('display_name').notNullable();
            tbl.string('password').notNullable();
            tbl.string('email').notNullable();
            tbl.string('resume');
            tbl.string('fb_id');
            tbl.string('fb_token');
            tbl.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            tbl.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        })
        .createTableIfNotExists('job', function(tbl) {
            tbl.increments('id').primary();
            tbl.string('title').notNullable();
            tbl.string('description').notNullable();
            tbl.string('budget').notNullable();
            tbl.timestamp('expires_at');
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('status_id').references('status.id').notNullable();
        })
        .createTableIfNotExists('thread', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('job_id').references('job.id');
        })
        .createTableIfNotExists('message', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('thread_id').references('thread.id').notNullable();
            tbl.string('message').notNullable();
            tbl.timestamp('timestamp').notNullable().defaultTo(knex.raw('now()'));
        })
        .createTableIfNotExists('appstatus', function(tbl) {
            tbl.increments('id').primary();
            tbl.string('status_name').notNullable();
        })
        .createTableIfNotExists('application', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('job_id').references('job.id');
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('appstatus_id').references('appstatus.id').notNullable();
        });

};

exports.down = function(knex, Promise) {

};
