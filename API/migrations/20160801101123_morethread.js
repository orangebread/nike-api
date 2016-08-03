exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('recipient')
        .createTableIfNotExists('recipient', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('message_id').references('message.id');
            tbl.integer('thread_id');
        })

};

exports.down = function(knex, Promise) {

};
