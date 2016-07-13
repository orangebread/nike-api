var login = require('../controllers/LoginController');
var job = require('../controllers/JobController');
var message = require('../controllers/MessageController');
var user = require('../controllers/UserController');

module.exports = function(app) {

    // no auth token required
    app.use('/api/login', login);

    // YOU SHALL NOT PASS (without a token)
    require('./tokenAuth')(app);
    app.use('/api/job', job);
    app.use('/api/message', message);
    app.use('/api/user', user);

    // invalid requests go here
    app.use('*', function(req, res){
        res.status(404)
            .json('This is not the resource you are looking for.');
    });
}