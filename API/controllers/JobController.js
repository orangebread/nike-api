var Job = require('../models/Job');
var Application = require('../models/Application');
var Message = require('../models/Message');
var Thread = require('../models/Thread');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');

// Get applications for user
router.get('/application', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            Application.forge()
                .query({where: {user_id: token.id}})
                .fetchAll()
                .then(function(result) {
                    console.log('Application retrieve result: ' + JSON.stringify(result));
                    res.status(200).json({ success: true, message: 'Applications retrieved.', result: result});
                })
                .catch(function(err) {
                    console.log('Error occurred while retrieving applications: ' + err);
                    res.status(200).json({ success: false, message: 'Error while retrieving applications.'});
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

// Post new Job
router.post('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            console.log('Posting job...');
            var title = req.body.title;
            var description = req.body.description;
            var budget = req.body.budget;
            var userId = token.id;
            var status = 1;
            var now = new Date();
            var expires_at = req.body.expires_at ? req.body.expires_at : new Date(+new Date + 12096e5);

            if (expires_at === null) {
                console.log('Generating expiration...');
                expires_at = now.setDate(now.getDate()+14);
            }

            var payload = {
                title: title,
                description: description,
                budget: budget,
                user_id: userId,
                status_id: status,
                expires_at: expires_at
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
            console.log('Error, something happened: ' + err);
        });
});

// Get job by user
router.get('/me', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            Job.forge()
                .query({where: {user_id: token.id}})
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

// Apply to job
router.post('/application', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var jobId = req.body.job_id;
            var message = req.body.message;
            var employerId = null;

            if (message === null || typeof message === 'undefined') {
                message = 'Application sent!';
            }

            Application.forge({
                job_id: jobId,
                user_id: token.id
            })
                .fetch()
                .then(function(result) {
                    console.log('Application result: ' + JSON.stringify(result));
                    if (result === null) {
                        Job.forge({
                            id: jobId
                        })
                            .fetch()
                            .then(function(response) {
                                employerId = response.attributes.user_id;

                                console.log('No applications, applying: ' + JSON.stringify(response));

                                Application.forge({
                                    job_id: jobId,
                                    user_id: token.id,
                                    appstatus_id: 1
                                })
                                    .save()
                                    .then(function(final) {
                                        console.log('Application saved with: ' + JSON.stringify(final));
                                        res.status(200).json({ success: true, message: 'Application saved!', result: final});
                                    })
                                    .catch(function(err) {
                                        console.log('Error while saving application: ' + err);
                                        res.status(200).json({ success: false, message: 'Application could not be saved.'});
                                    })
                            })
                            .catch(function(err) {
                                res.status(200).json({ success: false, message: 'Application could not be saved.'});
                            });

                    } else {
                        res.status(200).json({ success: false, message: 'Application already exists.'});
                    }
                })
                .catch(function(err) {
                    console.log('Error occurred while applying: ' + err);
                    res.status(200).json({ success: false, message: 'Error while applying.'});
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

module.exports = router;