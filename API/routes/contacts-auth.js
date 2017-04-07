var db = require('../config/db');
var contacts = require('../models/Contacts')({ db: db });

var express = require('express');
var router  = express.Router();

// Update Contact
router.put('/:id', function(req, res){
    var id = req.params.id;
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    var payload = {
        id: id,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    }

    contacts.update(payload)
        .then(function(result){
            res.json({ success: true, result: 'Sucessfully updated Contact.'});
        })
        .catch(function(err) {
            console.log('Error occurred while updating Contact: ' + err);
            res.json({ success: true, result: 'Error occurred while updating Contact.'});
        });
});

// Delete Contact
router.put('/:id', function(req, res){
    var id = req.params.id;

    var payload = {
        id: id
    }

    contacts.delete(payload)
        .then(function(result){
            res.json({ success: true, result: 'Sucessfully deleted Contact.'});
        })
        .catch(function(err) {
            console.log('Error occurred while deleting Contact: ' + err);
            res.json({ success: true, result: 'Error occurred while deleting Contact.'});
        });
});

module.exports = router;