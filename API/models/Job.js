var db = require('../config/db');

module.exports = db.Model.extend({
    tableName: 'job',

    // relationships
    user: function() {
        var User = require('./User');
        return this.belongsTo(User);
    },
    application: function() {
        var Application = require('./Application');
        return this.belongsToMany(Application);
    },
    recipient: function() {
        var Recipient = require('./Recipient');
        return this.belongsToMany(Recipient);
    }
    
});
