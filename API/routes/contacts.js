var db = require('../config/db');
var contacts = require('../models/Contacts')({ db: db });

var express = require('express');
var router  = express.Router();

// Create Contact
router.post('/', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    var payload = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    }

    contacts.create(payload)
        .then(function(result){
            res.json({ success: true, result: 'Sucessfully created Contact.'});
        })
        .catch(function(err) {
            console.log('Error occurred while creating Contact: ' + err);
            res.json({ success: true, result: 'Error occurred while creating Contact.'});
        });
});

// Retrieve Contact by ID
router.get('/:id', function(req, res){
    var id = req.params.id;

    var payload = {
        id: id
    }

    contacts.getById(payload)
        .then(function(result){
            console.log('Successfully retrieved Contact: ' + JSON.stringify(result));
            res.json({ success: true, result: result});
        })
        .catch(function(err) {
            console.log('Error occurred while retrieving Contact: ' + err);
            res.json({ success: true, result: 'Error occurred while retrieved Contact.'});
        });
});

// Retrieve Contact Collection
router.get('/', function(req, res){
    var filterOptions =  {
        email: req.query.email
    };

    contacts.getAll(filterOptions)
        .then(function(result){
            console.log('Successfully retrieved Contact: ' + JSON.stringify(result));
            res.json({ success: true, result: result});
        })
        .catch(function(err) {
            console.log('Error occurred while retrieving Contact: ' + err);
            res.json({ success: true, result: 'Error occurred while retrieved Contact.'});
        });
});

module.exports = router;