var login = require('../controllers/LoginController');
var job = require('../controllers/JobController');
var message = require('../controllers/MessageController');
var user = require('../controllers/UserController');
var search = require('../controllers/SearchController');
var application = require('../controllers/ApplicationController');
var merchant = require('../controllers/MerchantController');
var webhook = require('../controllers/WebhookController');

module.exports = function(app) {

    // no auth token required
    app.use('/api/login', login);
    app.use('/api/search', search);
    app.use('/api/webhook', webhook);

    // YOU SHALL NOT PASS (without a token)
    require('./tokenAuth')(app);
    app.use('/api/job', job);
    app.use('/api/application', application);
    app.use('/api/message', message);
    app.use('/api/user', user);
    app.use('/api/merchant', merchant);


    // invalid requests go here
    app.use('*', function(req, res){
        res.status(404)
            .json('This is not the resource you are looking for.');
    });
}