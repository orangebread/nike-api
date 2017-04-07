var contacts = require('../routes/contacts');
var contactsAuth = require('../routes/contacts-auth');

module.exports = function(app) {

    app.use('/api/contacts', contacts);

    // authentication required
    require('./auth')(app);
    app.use('/api/contacts', contactsAuth);

    // Invalid requests go here
    app.use('*', function(req, res){
        res.status(404)
            .json('This is not the resource you are looking for.');
    });
}