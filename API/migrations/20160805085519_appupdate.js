
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('application')
        .createTableIfNotExists('application', function(tbl) {
            tbl.increments('id').primary();
            tbl.integer('job_id').references('job.id').notNullable();
            tbl.integer('user_id').references('user.id').notNullable();
            tbl.integer('appstatus_id').references('appstatus.id').notNullable();
            tbl.integer('bid_amount');
            tbl.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        })
};

exports.down = function(knex, Promise) {

};
