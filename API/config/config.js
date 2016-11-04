'use strict';

module.exports = {
    development: {
        client: 'postgresql',
        debug: true,
        connection: {
            host: 'hadev01.c5um0qomkwp2.us-east-1.rds.amazonaws.com',
            user: 'mogaadmin',
            password: 'ThisIsSparta7229',
            database: 'hourlyadmin'
        }
    },
    production: {
        client: 'postgresql',
        debug: true,
        connection: {
            host: 'haprod02.c5um0qomkwp2.us-east-1.rds.amazonaws.com',
            user: 'mogaadmin',
            password: 'ThisIsSparta7229',
            database: 'hourlyadmin'
        }
    }
}