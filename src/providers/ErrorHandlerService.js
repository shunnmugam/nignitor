var createError = require('http-errors');
class ErrorHandlerService {

    constructor(app) {
        this.app = app;
    }

    boot() {
        const logger = use('logger');
        // catch 404 and forward to error handler
        this.app.use(function(req, res, next) {
            next(createError(404));
        });
        
        // error handler
        this.app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
        
            logger.error(err.message, err)
        
            // send error response
            res.status(err.status || 500);
            res.json({status: -1,error: true, details : err});
        });
    
    }
}

module.exports = ErrorHandlerService;