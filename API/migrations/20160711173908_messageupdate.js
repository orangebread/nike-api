
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('message')
        .createTableIfNotExists('message', function(tbl) {
            tbl.increments('id').primary();
            tbl.string('message').notNullable();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('received_by').references('user.id').notNullable();
            tbl.timestamp('timestamp').notNullable().defaultTo(knex.raw('now()'));
        });

};

exports.down = function(knex, Promise) {

};