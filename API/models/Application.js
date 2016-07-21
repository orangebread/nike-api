var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'application',

    // relationships
    user: function() {
        var User = require('./User');
        return this.belongsToMany(User);
    },

    job: function() {
        var Job = require('./Job');
        return this.belongsToMany(Job);
    }
});
