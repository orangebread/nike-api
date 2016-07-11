var jwt = require('jsonwebtoken');
var jwtUtils = require('../utils/jwtUtils');
var CONSTANTS = require('./constants');

module.exports = function(app) {
    app.use(function(req, res, next) {
        var newToken;
        // check header or url parameters or post parameters for token
        var token = req.headers.authorization || req.headers.token || req.query.token;

        console.log(JSON.stringify(req.headers));
        
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, CONSTANTS.SECRET, function(err, decoded) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    newToken = jwtUtils.refreshToken(decoded);
                    if(newToken) {
                        // Set the JWT refreshed token in http header
                        req.decoded = newToken;
                        res.set('Authorization', newToken);
                        next();
                    } else {
                        req.decoded = token;
                        res.set('Authorization', token);
                        next();
                    }
                }
            });

        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });
}
