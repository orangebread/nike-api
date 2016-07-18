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
            var receivedBy = req.body.received_by;

            // check if thread exists
            Message.forge({
                user_id: userId,
                received_by: receivedBy
                })
                .fetch()
                .then(function(result) {

                    // Not new message
                    if (result !== null) {
                        console.log('Not new message');
                        Message.forge({
                            thread_id: result.get('thread_id'),
                            user_id: userId,
                            received_by: receivedBy,
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
                            thread_id: uuid.v4(),
                            user_id: userId,
                            received_by: receivedBy,
                            message: message
                        })
                            .save()
                            .then(function(success) {
                                res.json({ success: true, message: 'Message saved successfully', result: success });
                            })
                            .catch(function(err) {
                                res.json({ success: false, message: 'Message saved failed' });
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
            var user_id = token.id;

            Message.forge()
                .query({ where: { user_id: user_id }, orWhere: { received_by: user_id } })
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