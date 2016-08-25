
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('merchant')
        .createTableIfNotExists('merchant', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.string('merchant_name').notNullable();
            tbl.string('merchant_status').notNullable();;
            tbl.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            tbl.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        })
};

exports.down = function(knex, Promise) {

};
