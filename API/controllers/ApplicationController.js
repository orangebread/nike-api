var Job = require('../models/Job');
var Application = require('../models/Application');
var Message = require('../models/Message');
var Thread = require('../models/Thread');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');

// Get applications for user
router.get('/', function(req, res){
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

// Apply to job
router.post('/', function(req, res){
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

// Accept/reject applications
router.put('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var jobId = req.body.job_id;
            var appId = req.body.application_id;
            var appstatus = req.body.app_status;
            var employerId = token.id;

            // verify job owner
            Job.forge()
                .query({ where: { id:  jobId }})
                .fetch()
                .then(function(job) {
                    if (job.attributes.user_id === employerId) {
                        Application.forge({ id: appId })
                            .save({ appstatus_id: appstatus })
                            .then(function(app) {
                                console.log('Application update successful.');
                                res.status(200).json({ success: true, message: 'Application update successful.', result: app });
                            })
                            .catch(function(err) {
                                console.log('Application update failed: ' + err);
                                res.status(200).json({ success: true, message: 'Application update failed.'});
                            });
                    } else {
                        console.log('Application update failed: Not job owner.');
                        res.status(200).json({ success: true, message: 'Application update failed. Not job owner.'});
                    }
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