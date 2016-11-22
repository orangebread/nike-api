var User = require('../models/User');
var express = require('express');
var router  = express.Router();
var jwt = require('jsonwebtoken');
var jwtUtils = require('../utils/jwtUtils');
var emailService = require('../utils/emailService');
var CONSTANTS = require('../config/constants');
var generator = require('generate-password');

// Login
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
                            console.log('Registration failed in creation.')
                        });
                })
                .catch(function(err) {
                    console.log('POST /api/login: ' + err);
                    res.json({success: false, message: 'Failed to login.'});
                });
        })
        .catch(function(err){
            console.log('Registration failed.');
            res.status(401).json({ success: false, message: 'Login failed. User not found.' });
        });


});

// Register user
router.post('/register', function(req, res){
    console.log('Initializing registration...');
    var email = req.body.email;
    var password = req.body.password;
    var displayName = req.body.display_name;

    jwtUtils.hashPassword(password)
        .then(function(hash) {
            console.log('Registration: password hashed.');
            User.register(email, hash, displayName)
                .then(function(user) {
                    console.log('Registering other stupid bullshit: ' + JSON.stringify(user));

                    if (user === null) {
                        res.json(user);
                    } else {
                        //create a new token
                        var payload = {
                            id: user.response.id
                        }

                        // send email notification
                        emailService.sendEmail(email,'Registration Complete', 'Welcome to Hourly Admin, thank you for signing up. You can access your account <a href="https://www.thehourlyadmin.com">here</a>. <br /> Thanks, <br /><br /> The Hourly Admin Team')
                            .then(function(success) {
                                console.log('Email sent: ' + JSON.stringify(success));

                                //create a new token
                                var token = jwt.sign(payload, CONSTANTS.SECRET, { expiresIn: CONSTANTS.TOKEN_EXPIRE });
                                res.json({ success: true, message: 'Successfully registered user.', displayName: user.response.display_name, token: token });
                            });
                    }

                })
                .catch(function(err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: 'Error registering user', result: err});
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
    var email = req.body.email;

    var payload = {
        email: req.body.email,
        fb_id: req.body.fb_id,
        fb_token: req.body.fb_token
    }
    User.forge({email: email})
        .fetch()
        .then(function (user) {
            console.log('User exists, creating facebook token...');
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
                            // send email notification
                            emailService.sendEmail(email,'Registration Complete', 'Welcome to Hourly Admin, thank you for signing up. You can access your account <a href="https://www.thehourlyadmin.com">here</a>. <br /> Thanks, <br /><br /> The Hourly Admin Team')
                                .then(function(success) {
                                    console.log('Email sent: ' + JSON.stringify(success));

                                    //create a new token
                                    var token = jwt.sign(payload, CONSTANTS.SECRET, { expiresIn: CONSTANTS.TOKEN_EXPIRE });
                                    res.json({ success: true, message: 'Successfully registered user.', displayName: user.response.display_name, token: token });
                                });
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
                var password = generator.generate({
                    length: 10,
                    numbers: true
                });
                jwtUtils.hashPassword(password)
                    .then(function(hashpw) {
                        generateDisplayName(email)
                            .then(function(newName) {
                                User.forge({
                                    email: email,
                                    password: hashpw,
                                    display_name: newName,
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

// private funcs
function generateDisplayName (email) {
    return new Promise(function (resolve, reject) {
        var emailName = email.split('@')[0];
        var digits = Math.floor(Math.random()*90000) + 10000;
        if (emailName.length <= 5) {
            var newName = emailName + digits;
            resolve(newName);
        } else {
            var length = 5;
            var trimmedString = emailName.substring(0, length);
            var newName = trimmedString + digits;
            resolve(newName);
        }
    });
}
module.exports = router;