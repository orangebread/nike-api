var Job = require('../models/Job');
var Application = require('../models/Application');
var Message = require('../models/Message');
var Thread = require('../models/Thread');
var db = require('../config/db');
var express = require('express');
var router  = express.Router();
var request = require('request');
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
            var employerId = req.body.employer_id;
            var bidAmount = req.body.bid_amount;
            var description = req.body.description;

            Application.forge({
                job_id: jobId,
                user_id: token.id
            })
                .fetch()
                .then(function(result) {
                    if (result === null) {
                        console.log('No applications, applying');

                        Application.forge({
                            job_id: jobId,
                            user_id: token.id,
                            bid_amount: bidAmount,
                            appstatus_id: 1,
                            description: description
                        })
                            .save()
                            .then(function(final) {
                                console.log('Application saved with: ' + JSON.stringify(final));
                                res.json({ success: true, message: 'Application saved!', result: final});
                            })
                            .catch(function(err) {
                                console.log('Error while saving application: ' + err);
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

// Accept applications
router.put('/accept', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var jobId = req.body.job_id;
            var appId = req.body.application_id;
            var employerId = token.id;

            // verify job owner
            Job.forge()
                .query({ where: { id:  jobId }})
                .fetch()
                .then(function(job) {
                    if (job.attributes.user_id === employerId) {
                        Application.forge({ id: appId })
                            .save({ appstatus_id: 2 })
                            .then(function(app) {
                                console.log('Application accept successful.');
                                Application.forge()
                                    .query({where: {
                                        job_id: jobId,
                                        appstatus_id: 1
                                    }})
                                    .fetchAll()
                                    .then(function(rejects) {
                                        var sql = 'update application \
                                                    set appstatus_id = 3 \
                                                    where application.appstatus_id = 1 and application.job_id = ?';
                                        db.knex.raw(sql, [jobId])
                                            .then(function(result) {
                                                console.log('Applications retrieved.');
                                                res.status(200).json({ success: true, message: 'Application accept successful.', result: app });
                                            })
                                            .catch(function(err) {
                                                console.log('Applications retrieve failed: ' + err);
                                                res.status(200).json({ success: false, message: 'Applications retrieve failed.'});
                                            });
                                    });
                            })
                            .catch(function(err) {
                                console.log('Application update failed: ' + err);
                                res.status(200).json({ success: false, message: 'Application update failed.'});
                            });
                    } else {
                        console.log('Application update failed: Not job owner.');
                        res.status(200).json({ success: true, message: 'Application update failed. Not job owner.'});
                    }
                })
                .catch(function(err) {
                    console.log('Job get failed: ' + err);
                    res.status(401).json({ success: false, message: 'Job get failed.' });
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });

});

// Reject application
router.put('/reject', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var jobId = req.body.job_id;
            var appId = req.body.application_id;
            var employerId = token.id;

            // verify job owner
            Job.forge()
                .query({ where: { id:  jobId }})
                .fetch()
                .then(function(job) {
                    if (job.attributes.user_id === employerId) {
                        Application.forge({ id: appId })
                            .save({ appstatus_id: 3 })
                            .then(function(app) {
                                console.log('Application reject successful.');
                                res.status(200).json({ success: true, message: 'Application reject successful.', result: app });
                            })
                            .catch(function(err) {
                                console.log('Application reject failed: ' + err);
                                res.status(200).json({ success: true, message: 'Application reject failed.'});
                            });
                    } else {
                        console.log('Application reject failed: Not job owner.');
                        res.status(200).json({ success: true, message: 'Application update failed. Not job owner.'});
                    }
                })
                .catch(function(err) {
                    console.log('Job get failed: ' + err);
                    res.status(401).json({ success: false, message: 'Job get failed.' });
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });

});

module.exports = router;