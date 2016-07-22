var db = require('../config/db');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
var uuid = require('node-uuid');
var jwtUtils = require('../utils/jwtUtils');

module.exports = db.Model.extend({
    tableName: 'user',

    //relationships
    message: function() {
        var Message = require('./Message');
        return this.hasMany(Message);
    },

    hidden: ['id', 'password', 'fb_token', 'fb_id', 'created_at', 'updated_at']

}, {

    comparePassword: function(password, hash) {
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, hash, function(err, res) {
                console.log('Comparing password result: ' + err);
                if (err) {
                    reject(err)
                } else {
                    resolve(res);
                }
            });
        })
    },

    generateDisplayName: function(email) {
        var emailName = email.split('@')[0];
        var digits = Math.floor(Math.random()*90000) + 10000;
        if (emailName.length <= 5) {
            var newName = emailName + digits;
            return newName;
        } else {
            var length = 5;
            var trimmedString = emailName.substring(0, length);
            var newName = trimmedString + digits;
            return newName;
        }
    },

    register: Promise.method(function(email, password, displayName) {
        console.log('Registering user');
        if(!email || !password) {
            console.log('Registration failed.');
            return ({ success: false, message: 'Please enter email and password.' });
        } else {
            console.log('Registration executing...');
            var saveDisplayName = null;
            if(!displayName) {
                saveDisplayName = this.generateDisplayName(email);
            } else {
                saveDisplayName = displayName;
            }
            // Attempt to save the user
            return new this({email: email.toLowerCase().trim(), password: password, display_name: saveDisplayName})
                .save()
                .then(function(res) {
                    console.log('Registration succeeded.');
                    return ({ success: true, response: res.omit(['password'])});
                }).catch(function(err) {
                    console.log(err);
                    console.log('Registration failed. Email already exists');
                    return ({ success: false, message: 'That email address already exists.'});
                });


        }
    })

});