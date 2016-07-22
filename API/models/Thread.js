var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'thread',

    // relationships
    job: function() {
        var Job = require('./Job');
        return this.belongsToMany(Job);
    }
});
