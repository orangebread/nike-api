
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('transaction_sent')
        .dropTableIfExists('transaction')
        .createTableIfNotExists('transaction', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.string('transaction').notNullable();
            tbl.string('transaction_status').notNullable();
            tbl.string('escrow_status').notNullable();
            tbl.integer('job_id').references('job.id').notNullable();
            tbl.float('amount').notNullable();
            tbl.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            tbl.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        })
        .createTableIfNotExists('transaction_sent', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('transaction_id').references('transaction.id').notNullable();
        })
};

exports.down = function(knex, Promise) {

};
