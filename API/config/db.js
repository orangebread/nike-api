
// initialize connection to database
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
var knex = require('knex')(config);
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('visibility');

module.exports = bookshelf;