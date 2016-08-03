var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'thread',

    // relationships
    user: function() {
        var User = require('./User');
        return this.belongsToMany(User);
    },
    message: function() {
        var Message = require('./Message');
        return this.hasMany(Message);
    }
});
