module.exports = function(app) {

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // no stacktraces leaked to user unless in development environment
    app.use(function(err, req, res, next) {
        res.json({ success: false, errorCode: err.status || 500, message: err.message});
    });
}   