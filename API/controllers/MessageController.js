var Message = require('../models/Message');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');

// Post new Message
router.post('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            console.log('User verified');

            var message = req.body.message;
            var sent_by = token.id;
            var received_by = req.body.received_by;

            var payload = {
                message: message,
                user_id: sent_by,
                received_by: received_by
            };

            Message.forge(payload)
                .save()
                .then(function(result) {
                    console.log('Message saved success: ' + result);
                    res.status(200).json({ success: true, message: 'Message sent successfully.'});
                })
                .catch(function(err){
                    console.log('Message sent failed: ' + err);
                    res.status(401).json({ success: false, message: 'Message sent failed.' });
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