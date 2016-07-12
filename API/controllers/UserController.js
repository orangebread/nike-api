var User = require('../models/User');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');

// Get messages by user ID
router.get('/:id', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var user_id = req.params.id;

            User.forge({ id: user_id })
                .fetch()
                .then(function(result) {
                    console.log('User retrieve successful');
                    res.status(200).json({ success: true, message: 'User retrieve successful.', result: result});
                })
                .catch(function(err){
                    console.log('User retrieve failed: ' + err);
                    res.status(401).json({ success: false, message: 'User retrieve failed.' });
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

module.exports = router;