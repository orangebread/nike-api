var generatePassword = require('password-generator');
var Promise = require('bluebird');

module.exports = {
    generatePassword: function() {
        return new Promise(function(resolve, reject) {
            var password = generatePassword(12, false, /\d/);
            resolve(password);
        });
    }

}
