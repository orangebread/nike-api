var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'application',

    // relationships
    user: function() {
        var User = require('./User');
        return this.belongsToMany(User);
    },
    message: function() {
        var Recipient = require('./Recipient');
        var Message = require('./Message');
        return this.belongsToMany(Message).through(Recipient);
    },
    job: function() {
        var Job = require('./Job');
        return this.belongsToMany(Job);
    },
    recipient: function() {
        var Recipient = require('./Recipient');
        return this.belongsToMany(Recipient);
    }
});
