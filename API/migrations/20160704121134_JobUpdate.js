
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('job')
        .dropTableIfExists('user')
        .dropTableIfExists('status')
        .createTableIfNotExists('user', function(tbl) {
            tbl.increments('id').primary();
            tbl.string('email').notNullable();
            tbl.string('password').notNullable();
            tbl.string('display_name');
            tbl.string('fb_id');
            tbl.string('fb_token');
            tbl.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            tbl.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        })
        .createTableIfNotExists('status', function(tbl) {
            tbl.increments('id').primary();
            tbl.string('status_name').notNullable();
        })
        .createTableIfNotExists('job', function(tbl) {
            tbl.increments('id').primary();
            tbl.string('title').notNullable();
            tbl.string('description').notNullable();
            tbl.string('budget').notNullable();
            tbl.timestamp('expires_at').notNullable();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('status_id').references('status.id').notNullable();
        })

};

exports.down = function(knex, Promise) {

};
