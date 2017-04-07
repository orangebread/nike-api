var express = require('express');
var app = express();

// middleware
require('./config/express')(app);

// connect database
require('./config/db');

// routing/endpoints
require('./config/routes')(app);

// error handling
require('./config/errorHandler')(app);

module.exports = app;
