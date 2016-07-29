exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('recipient')
        .dropTableIfExists('message')
        .createTableIfNotExists('message', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.string('message').notNullable();
            tbl.timestamp('timestamp').notNullable().defaultTo(knex.raw('now()'));
        })
        .createTableIfNotExists('recipient', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('message_id').references('message.id');
            tbl.integer('application_id').references('application.id');
        })

};

exports.down = function(knex, Promise) {

};
