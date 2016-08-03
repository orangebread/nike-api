
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('user_thread')
        .dropTableIfExists('message')
        .dropTableIfExists('thread')
        .createTableIfNotExists('thread', function(tbl) {
            tbl.increments('id').primary();
        })
        .createTableIfNotExists('thread_user', function(tbl) {
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('thread_id').references('thread.id').notNullable();
        })
        .createTableIfNotExists('message', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('thread_id').references('thread.id').notNullable();
            tbl.string('message').notNullable();
            tbl.timestamp('timestamp').notNullable().defaultTo(knex.raw('now()'));
        })
};

exports.down = function(knex, Promise) {

};
