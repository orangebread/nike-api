var Message = require('../models/Message');
var User = require('../models/User');
var Thread = require('../models/Thread');
var UserThread = require('../models/UserThread');
var uuid = require('node-uuid');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');
var Promise = require('bluebird');

// Post new Message
router.post('/new', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            console.log('User verified');
            var message = req.body.message;
            var userId = token.id;
            var employerId = req.body.employer_id;

            Thread.forge()
                .save()
                .then(function(thread) {
                    console.log('Thread created successfully.');
                    createParticipants(thread.id, userId, employerId)
                        .then(function(done) {
                            Message.forge({
                                thread_id: thread.id,
                                user_id: userId,
                                message: message
                            })
                                .save()
                                .then(function(final) {
                                    res.json({ success: true, message: 'Message created successfully', result: final });
                                })
                                .catch(function(err) {
                                    console.log('Messages failed to create: ' + err);
                                    res.json({ success: false, message: 'Message failed to create', result: err });
                                })
                        })
                        .catch(function(err) {
                            console.log('Participants failed to create: ' + err);
                            res.json({ success: false, message: 'Participants failed to create'});
                        })
                })
                .catch(function(err) {
                    console.log('Thread created failed. ' + err);
                });

        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

// Message replies
router.post('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            console.log('User verified');
            var message = req.body.message;
            var userId = token.id;
            var threadId = req.body.thread_id;

            Message.forge({
                user_id: userId,
                thread_id: threadId,
                message: message
            })
                .save()
                .then(function(result) {
                    console.log('Message reply succcess.');
                    res.json({ success: true, message: 'Message sent successfully.', result: result});
                })
                .catch(function(err) {
                    console.log('Message reply failed: ' + err );
                    res.json({ success: false, message: 'Message failed to send.'});
                });

        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

// Get thread/message collection for user
router.get('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var userId = token.id;
            User.forge()
                .query({where: {id: userId}})
                .fetchAll({ withRelated: ['thread.message'], require: true})
                .then(function(result) {
                    console.log('Message retrieve successful');
                    res.status(200).json({ success: true, message: 'Message retrieve successful.', result: result});
                })
                .catch(function(err){
                    console.log('Message retrieve failed: ' + err);
                    res.status(401).json({ success: false, message: 'Message retrieve failed.' });
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

// Get thread collection only - no messages
router.get('/thread', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var userId = token.id;
            User.forge()
                .query({where: {id: userId}})
                .fetchAll({ withRelated: ['thread'], require: true})
                .then(function(result) {
                    console.log('Thread retrieve successful');
                    res.status(200).json({ success: true, message: 'Thread retrieve successful.', result: result});
                })
                .catch(function(err){
                    console.log('Thread retrieve failed: ' + err);
                    res.status(401).json({ success: false, message: 'Thread retrieve failed.' });
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

// Get messages by thread id
router.get('/thread/:id', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var threadId = req.params.id;
            Thread.forge()
                .query({where: {id: threadId}})
                .fetchAll({ withRelated: ['message'], require: true})
                .then(function(result) {
                    console.log('Message retrieve successful');
                    res.status(200).json({ success: true, message: 'Message retrieve successful.', result: result});
                })
                .catch(function(err){
                    console.log('Message retrieve failed: ' + err);
                    res.status(401).json({ success: false, message: 'Message retrieve failed.' });
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

//**** Private funcs

// init participants
function createParticipants(thread, sender, receiver) {
    console.log('Create init values: ' + thread + ' ' + sender + ' ' + receiver);
    return new Promise(function(resolve, reject) {
        User.forge({
            id: sender
        })
            .thread()
            .attach(thread)
            .then(function(userthread) {
                console.log('Create parts still going...');
                User.forge({
                    id: receiver
                })
                    .thread()
                    .attach(thread)
                    .then(function(userthread) {
                        resolve(userthread);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
            .catch(function(err) {
                reject(err);
            });
    });
}
module.exports = router;