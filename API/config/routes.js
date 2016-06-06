var user  = require('../controllers/BoomUserController');
var login = require('../controllers/LoginController');
var playlist = require('../controllers/PlaylistController');
var boombox = require('../controllers/BoomBoxController');

module.exports = function(app) {

    app.use('/api/login', login); 

    require('./tokenAuth')(app); // YOU SHALL NOT PASS (without a token)
    app.use('/api/user', user);
    app.use('/api/playlist', playlist);
    app.use('/api/boombox', boombox);

    app.use('*', function(req, res){
        res.status(404)
            .json('This is not the resource you are looking for.');
    });
}