
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('thread')
        .createTableIfNotExists('thread', function(tbl) {
            tbl.integer('application_id').references('application.id').notNullable();
            tbl.integer('user_id').references('user.id').notNullable();
        })
};

exports.down = function(knex, Promise) {

};
