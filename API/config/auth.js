module.exports = function(app) {
    app.use(function(req, res, next) {
        var auth = req.headers.authorization;
        console.log("Authorization Header is: ", auth);

        if(!auth) {
            console.log('No auth');
            return res.json({ success: false, message: 'You require authentication to perform this action.' });
        }
        else {
            console.log('Auth');
            var creds = auth.split(':');
            var username = creds[0];
            var password = creds[1];

            if((username == 'admin') && (password == 'admin')) {
                next();
            }
            else {
                return res.json({ success: false, message: 'Wrong user and password.' });
            }
        }
    });
}
