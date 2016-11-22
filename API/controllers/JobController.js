var Job = require('../models/Job');
var Application = require('../models/Application');
var Message = require('../models/Message');
var Thread = require('../models/Thread');
var User = require('../models/User');
var db = require('../config/db');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');
var emailService = require('../utils/emailService');

// Get applications for job
router.get('/:id/application', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var jobId = req.params.id;
            Job.forge({ id: jobId })
                .fetch({ require: true })
                .then(function(job) {
                    //
                    if (job.attributes.user_id === token.id) {
                        var sql = 'SELECT a.id as application_id, a.job_id, a.user_id, "user".email, "user".display_name, a.bid_amount, a.description, a.status_name as application_status \
                                    FROM (SELECT application.id, application.job_id, application.user_id, application.bid_amount, application.description, appstatus.status_name FROM application \
                                    JOIN appstatus \
                                    on application.appstatus_id = appstatus.id) a \
                                    JOIN "user" \
                                    ON a.user_id = "user".id \
                                    WHERE a.job_id = ?';
                        db.knex.raw(sql, [jobId])
                            .then(function(result) {
                                console.log('Applications retrieved.');
                                res.status(200).json({ success: true, message: 'Applications retrieved.', result: result.rows});
                            })
                            .catch(function(err) {
                                console.log('Applications retrieve failed: ' + err);
                                res.status(200).json({ success: false, message: 'Applications retrieve failed.'});
                            });
                    } else {
                        console.log('Not the right user to retrieve');
                        res.status(200).json({ success: false, message: 'Request not made by job owner.'});
                    }
                })
                .catch(function(err) {
                    console.log('Job not found: ' + err );
                    res.status(200).json({ success: false, message: 'Job applications retrieve failed.'});
                });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
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
                    var jobTitle = result.attributes.title;

                    User.forge({ id: token.id })
                        .fetch()
                        .then(function(user) {
                            // send email notification
                            emailService.sendEmail(email,'Job Posted', 'Your job with title <b>' + jobTitle + '</b> has been succesfully posted, we will notify you if someone applies to work on it. <br /> Thanks, <br /><br /> The Hourly Admin Team')
                                .then(function(success) {
                                    console.log('Email sent for job creation: ' + JSON.stringify(success));

                                    res.status(200).json({ success: true, message: 'Job posting successful.'});
                                });
                        });

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

// Workflow
router.post('/workflow', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var jobId = req.body.job_id;
            var workflow = req.body.workflow_id;

            if (workflow === 1 ||
                workflow === 2 ||
                workflow === 5) {
                Job.forge({
                    id: jobId,
                    user_id: token.id
                })
                    .fetch()
                    .then(function(job) {
                        job
                            .save({ status_id: workflow })
                            .then(function(final) {
                                console.log('Job workflow updated');
                                // send email notification
                                emailService.sendEmail(user.attributes.email,'Hourly Admin - Workflow Updated', 'Your job has been updated, check your <a href="https://www.thehourlyadmin.com">account</a> page for more details!')
                                    .then(function(success) {
                                        res.json({ success: true, message: 'Job workflow updated!', result: final });
                                    });
                            })
                            .catch(function(err) {
                                console.log('Job workflow failed: ' + err);
                                res.json({ success: true, message: 'Job workflow failed.' });
                            });
                    })
                    .catch(function(err) {
                        console.log('Job workflow fcked up: ' + err);
                        res.json({ success: false, message: 'Job workflow update failed. You are not the employer.' });
                    });
            } else {
                console.log('Not job owner');
                Application.forge({
                    job_id: jobId,
                    user_id: token.id,
                    appstatus_id: 2
                })
                    .fetch()
                    .then(function(app) {
                        Job.forge({
                            id: jobId
                        })
                            .save({ status_id: workflow })
                            .then(function(job) {
                                console.log('Job workflow updated');
                                res.json({ success: true, message: 'Job workflow updated!', result: job });
                            })
                            .catch(function(err) {
                                console.log('Job workflow failed: ' + err);
                                res.json({ success: true, message: 'Job workflow failed.' });
                            });
                    })
                    .catch(function(err) {
                        console.log('Job workflow fcked up: ' + err);
                        res.json({ success: false, message: 'Job workflow update failed.' });
                    });
            }
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
        });

});


module.exports = router;