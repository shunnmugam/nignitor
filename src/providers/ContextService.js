var context = require('../utils/context');
var {randomString} = require('../utils/string');
class ContextService {
    constructor(app) {
        this.app = app;
    }
    boot() {
        this.app.use(function(req, res, next) {
            var uId = Date.now() + '-' +randomString(5);
            context.run(() => {
                context.set('uId', uId)
            })
            req.uId = uId;
            next();
        });
    }
}

module.exports = ContextService;