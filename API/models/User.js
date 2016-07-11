var db = require('../config/db');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');
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
            bcrypt.compare(password, hash, function (err, res) {
                if (err) reject(err);
                resolve(res);
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
        if(!email || !password) {
            return ({ success: false, message: 'Please enter email and password.' });
        } else {
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
                    return ({ success: true, response: res.omit(['password'])});
                }).catch(function(err) {
                    console.log(err);
                    return ({ success: false, message: 'That email address already exists.'});
                });


        }
    })

});