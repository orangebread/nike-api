var Job = require('../models/Job');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');

// Post new Job
router.post('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var title = req.body.title;
            var description = req.body.description;
            var budget = req.body.budget;
            var userId = token.id;
            var status = 1;
            var expires_at = req.body.expires_at;
            var now = new Date();
            var dateExpire = new Date(expires_at);

            if (expires_at === null) {
                dateExpire = now.setDate(now.getDate()+14);
            }
            
            console.log('Expiration ' + dateExpire);
            var payload = {
                title: title,
                description: description,
                budget: budget,
                user_id: userId,
                status_id: status,
                expires_at: dateExpire
            };

            Job.forge(payload)
                .save()
                .then(function(result) {
                    console.log('Job post success: ' + result);
                    res.status(200).json({ success: true, message: 'Job posting successful.'});
                })
                .catch(function(err){
                    console.log('Job post failed: ' + err);
                    res.status(401).json({ success: false, message: 'Job posting failed.' });
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

// Get job collection
router.get('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            Job.forge()
                .fetchAll()
                .then(function(result) {
                    console.log('Job get successful: ' + result);
                    res.status(200).json({ success: true, message: 'Job posting successful.', result: result});
                })
                .catch(function(err){
                    console.log('Job get failed: ' + err);
                    res.status(401).json({ success: false, message: 'Job posting failed.' });
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

// Get job by id
router.get('/:id', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var id = req.params.id;
            Job.forge({ id: id })
                .fetch()
                .then(function(result) {
                    console.log('Job get successful: ' + result);
                    res.status(200).json({ success: true, message: 'Job posting successful.', result: result});
                })
                .catch(function(err){
                    console.log('Job get failed: ' + err);
                    res.status(401).json({ success: false, message: 'Job posting failed.' });
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

module.exports = router;