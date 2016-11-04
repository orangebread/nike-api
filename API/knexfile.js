// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: 'hadev01.c5um0qomkwp2.us-east-1.rds.amazonaws.com',
      user: 'mogaadmin',
      password: 'ThisIsSparta7229',
      database: 'hourlyadmin'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'postgresql',
      connection: {
        host: 'haprod02.c5um0qomkwp2.us-east-1.rds.amazonaws.com',
        user: 'mogaadmin',
        password: 'ThisIsSparta7229',
        database: 'hourlyadmin'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
  }
}
