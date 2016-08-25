var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'merchant',

    // relationships
    user: function() {
        var User = require('./User');
        return this.belongsTo(User);
    }
});
