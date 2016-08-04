var Job = require('../models/Job');
var express = require('express');
var router  = express.Router();


// Get job collection
router.get('/job', function(req, res){
    Job.forge()
        .fetchAll()
        .then(function(result) {
            console.log('Job get successful: ' + result);
            res.status(200).json({ success: true, message: 'Job retrieve successful.', result: result});
        })
        .catch(function(err){
            console.log('Job get failed: ' + err);
            res.status(401).json({ success: false, message: 'Job retrieve failed.' });
        });
});

// Get job by id
router.get('/job/:id', function(req, res){
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
});

module.exports = router;