var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'message',

    // relationships
    user: function() {
        var User = require('./User');
        return this.belongsToMany(User);
    }
});
