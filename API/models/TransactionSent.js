var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'transaction_sent',

    // relationships
    user: function() {
        var User = require('./User');
        return this.belongsTo(User);
    },
    transaction: function() {
        var Transaction = require('./Transaction');
        return this.belongsTo(Transaction);
    }
});
