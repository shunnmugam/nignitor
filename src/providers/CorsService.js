var cors = require('cors');
class CorsService {
    constructor(app) {
        this.app = app;
    }

    register() {
        var config = use('config');
        if(config('cors.isActive', true) === true) {
            var whitelist = config('cors.whitelist', []).split(",");
            var corsOptions = function(req, callback) {
                var corsOptions, origin = req.header('Origin');    
                var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
                var originIsWhitelisted2 = whitelist.indexOf('http://'+req.header('host')) !== -1;
                if (originIsWhitelisted || originIsWhitelisted2) {
                    corsOptions = { origin: true, credentials: true } // reflect (enable) the requested origin in the CORS response
                } else {
                    corsOptions = { origin: false, credentials: true } // disable CORS for this request
                }
                callback((originIsWhitelisted || originIsWhitelisted2) ? null : new Error('WARNING: CORS Origin Not Allowed'), corsOptions) // callback expects two parameters: error and options
            
            }
            if(process.env.NODE_ENV === undefined)
                this.app.use(cors(corsOptions));
            else
                this.app.use(cors());
        }
    }

}

module.exports = CorsService;