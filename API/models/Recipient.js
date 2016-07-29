var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'recipient',

    // relationships
    application: function() {
        var Job = require('./Job');
        return this.belongsToMany(Job);
    },
    message: function() {
        var Message = require('./Message');
        return this.hasMany(Message);
    }
});
