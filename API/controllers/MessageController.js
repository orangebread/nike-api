var Message = require('../models/Message');
var User = require('../models/User');
var uuid = require('node-uuid');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');

// Post new Message
router.post('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            console.log('User verified');
            var message = req.body.message;
            var userId = token.id;
            var threadId = req.body.thread_id;

            // check if thread exists
            Message.forge({
                user_id: userId,
                thread_id: threadId
                })
                .fetch()
                .then(function(result) {

                    // Not new message
                    if (result !== null) {
                        console.log('Not new message');
                        Message.forge({
                            thread_id: threadId,
                            user_id: userId,
                            message: message
                        })
                            .save()
                            .then(function(success) {
                                res.json({ success: true, message: 'Message saved successfully', result: success });
                            })
                            .catch(function(err) {
                                res.json({ success: false, message: 'Message saved failed' });
                            });
                    } else { // New message
                        console.log('New message');
                        Message.forge({
                            user_id: userId,
                            received_by: receivedBy,
                            message: message
                        })
                            .save()
                            .then(function(success) {
                                res.json({ success: true, message: 'Message saved successfully', result: success });
                            })
                            .catch(function(err) {
                                res.json({ success: false, message: 'New message saved failed' });
                            });

                    }   
                })
                .catch(function(err) {
                    console.log('Shit happened while message: ' + err);
                });
        })
        .catch(function(err) {
            console.log('User not verified.');
        });
});

// Get messages by user ID
router.get('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var userId = token.id;

            Message.forge()
                .query({where: { user_id: userId }})
                // .fetch({ withRelated: ['thread'], require: true })
                .orderBy('thread_id')
                .fetchAll()
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

module.exports = router;