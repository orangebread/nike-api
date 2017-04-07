var db = require('sqlite');
// var db = new sqlite3(':memory:');
var Promise = require('bluebird');

Promise.resolve()
// First, try to open the database
    .then(() => db.open('./database.sqlite', { Promise }))      // <=
// Update db schema to the latest version using SQL-based migrations
.then(() => db.migrate({ force: 'last' }))                  // <=
// Display error message if something went wrong
.catch((err) => console.error(err.stack))
// Finally, launch the Node.js app


module.exports = db;