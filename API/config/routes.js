var login = require('../controllers/LoginController');
var job = require('../controllers/JobController');

module.exports = function(app) {

    app.use('/api/login', login); 

    require('./tokenAuth')(app); // YOU SHALL NOT PASS (without a token)
    app.use('/api/job', job);

    app.use('*', function(req, res){
        res.status(404)
            .json('This is not the resource you are looking for.');
    });
}