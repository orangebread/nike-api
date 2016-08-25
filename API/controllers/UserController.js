var User = require('../models/User');
var db = require('../config/db');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');

// Get user data by user ID
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

// Get self user data
router.get('/', function(req, res){ 
    jwtUtils.decryptToken(req, res)
         .then(function(token){
            var sql = 'SELECT u.id, u.display_name, u.email, m.merchant_name, m.merchant_status \
                         FROM "user" u \
                         JOIN merchant m \
                         ON u.id = m.user_id \
                         WHERE u.id = ?';
               db.knex.raw(sql, [token.id]) 
                   .then(function(result) {
                      res.status(200).json({ success: true, message: 'User retrieved', result: result.rows}); 
                    })
                    .catch(function(err) { 
                        console.log('User retrieve failed: ' + err);
                         res.status(200).json({ success: false, message: 'User retrieve failed.'}); 
                    });
                  })
        .catch(function(err) {
            console.log('User not verified.' + err);
            res.status(200).json({ success: false, message: 'User retrieve failed.'});
        });
 });

module.exports = router;