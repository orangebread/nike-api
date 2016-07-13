var User = require('../models/User');
var express = require('express');
var router  = express.Router();
var jwt = require('jsonwebtoken');
var jwtUtils = require('../utils/jwtUtils');
var CONSTANTS = require('../config/constants');


router.post('/', function(req, res){
    var email = req.body.email;
    var password = req.body.password;

    User.forge({ email: email })
        .fetch()
        .then(function(coll) {
            User.comparePassword(password, coll.attributes.password)
                .then(function(result){
                    User.forge({
                        id: coll.attributes.id
                    })
                        .fetch()
                        .then(function(user) {
                            var payload = {
                                id: user.id,
                                email: user.email
                            }
                            //create a new token
                            var token = jwt.sign(payload, CONSTANTS.SECRET, { expiresIn: CONSTANTS.TOKEN_EXPIRE });

                            res.json({ success: true, displayName: user.attributes.display_name, token: token , message: 'Successfully logged in.'});

                        })
                        .catch(function(err) {

                        });
                })
                .catch(function(err) {
                    console.log('POST /api/login: ' + err);
                    res.json({success: false, message: 'Failed to login.'});
                });
        })
        .catch(function(err){
            res.status(401).json({ success: false, message: 'Login failed. User not found.' });
        });


});

router.post('/register', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var displayName = req.body.display_name;

    jwtUtils.hashPassword(password)
        .then(function(hash) {
            User.register(email, hash, displayName)
                .then(function(user) {
                    console.log(user);
                    //create a new token
                    var payload = {
                        id: user.response.id
                    }
                    //create a new token
                    var token = jwt.sign(payload, CONSTANTS.SECRET, { expiresIn: CONSTANTS.TOKEN_EXPIRE });
                    res.json({ success: true, message: 'Successfully registered user.', displayName: user.response.display_name, token: token });
                })
                .catch(function(err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: 'Error registering user'});
                });
        })
        .catch(function(err) {
            console.log(err);
            res.json({ success: false, message: 'Error hashing pw'});
        });

});

router.post('/verify', function(req, res) {
    jwtUtils.verifyToken(req)
        .then(function(result) {
            console.log('verify: ' + JSON.stringify(result));
            res.json({ success: true, message: 'Token verified!' });
        })
        .catch(function(err) {
            console.log(err);
            res.json({ success: false, message: 'Token not verified!' });
        });
});

router.get('/lostpassword', function(req, res) {
    res.json('TODO');
});

router.get('/forgotusername', function(req, res) {
    res.json('TODO');
});

// SSO Strategies
router.post('/facebook', function(req, res) {
    var payload = {
        email: req.body.email,
        fb_id: req.body.fb_id,
        fb_token: req.body.fb_token
    }
    User.forge({email: payload.email})
        .fetch()
        .then(function (user) {
            // User found, see if they have facebook creds
            if (user) {
                if (!user.attributes.fb_id || !user.attributes.fb_token) {
                    new User({ id: user.id })
                        .save({
                            fb_id: payload.fb_id,
                            fb_token: payload.fb_token
                        }, { patch: true })
                        .then(function(savedUser) {
                            var tokenInfo = {
                                id: user.attributes.id,
                                email: payload.email
                            }

                            var token  = jwt.sign(tokenInfo, CONSTANTS.SECRET, { expiresIn : CONSTANTS.TOKEN_EXPIRE });
                            console.log('Saving fb stuff: ' + JSON.stringify(savedUser));
                            res.json({ success: true, displayName: user.attributes.display_name, message: 'Successfully logged in with facebook.', token: token});
                        })
                        .catch(function(err) {
                            console.log('Error saving fb existing: ' + err);
                            res.json({ success: false, message: 'Failed to log in with facebook.'});
                        });
                } else {
                    var tokenInfo = {
                        id: user.attributes.id,
                        email: payload.email
                    }
                    var token  = jwt.sign(tokenInfo, CONSTANTS.SECRET, { expiresIn : CONSTANTS.TOKEN_EXPIRE });
                    res.json({ success: true, displayName: user.attributes.display_name, message: 'Successfully logged in with facebook.', token: token});
                }
            } else {
                jwtUtils.hashPassword(password)
                    .then(function(hashpw) {
                        User.forge({
                            email: email,
                            password: hashpw,
                            //user.image = profile._json.image.url;
                            //user.displayName = profile.displayName;

                            fb_id: payload.fb_id,
                            fb_token: payload.fb_token
                        })
                            .save()
                            .then(function (res) {
                                var payload = {
                                    id: res.attributes.id,
                                    email: email
                                }
                                var token = jwt.sign(payload, CONSTANTS.SECRET, { expiresIn : CONSTANTS.TOKEN_EXPIRE });
                                res.json({ success: true, displayName: user.attributes.display_name, message: 'Successfully logged in with facebook.', token: token});
                            })
                            .catch(function (err) {
                                console.log('Error on creating fbuser: ' + err);
                                res.json({ success: false, message: 'Failed to log in with facebook.'});
                            });
                    })
                    .catch(function(err) {
                        console.log('hashing pw in fb err: ' + err);
                        res.json({ success: false, message: 'Failed to log in with facebook. Hash error.'});
                    });

            }
        })
        .catch(function (err) {
            console.log('Error on retrieving fbuser: ' + err);
            res.json({ success: false, message: 'Failed to log in with facebook.'});
        });

});


module.exports = router;