
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('message')
        .createTableIfNotExists('message', function(tbl) {
            tbl.increments('id').primary();
            tbl.string('message').notNullable();
            tbl.integer('sent_by').references('user.id').notNullable();
            tbl.integer('received_by').references('user.id').notNullable();
        });

};

exports.down = function(knex, Promise) {

};
