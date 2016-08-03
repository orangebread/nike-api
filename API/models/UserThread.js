var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'thread_user',

    // relationships
    user: function() {
        var User = require('./User');
        return this.belongsToMany(User);
    },
    thread: function() {
        var Thread = require('./Thread');
        return this.belongsToMany(Thread);
    }
});
