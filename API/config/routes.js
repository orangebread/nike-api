var login = require('../controllers/LoginController');

module.exports = function(app) {

    app.use('/api/login', login); 

    require('./tokenAuth')(app); // YOU SHALL NOT PASS (without a token)

    app.use('*', function(req, res){
        res.status(404)
            .json('This is not the resource you are looking for.');
    });
}