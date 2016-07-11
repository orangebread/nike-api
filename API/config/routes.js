var login = require('../controllers/LoginController');
var job = require('../controllers/JobController');
var message = require('../controllers/MessageController');

module.exports = function(app) {

    app.use('/api/login', login); 

    require('./tokenAuth')(app); // YOU SHALL NOT PASS (without a token)
    app.use('/api/job', job);
    app.use('/api/message', message);

    app.use('*', function(req, res){
        res.status(404)
            .json('This is not the resource you are looking for.');
    });
}