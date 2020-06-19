const config = require('../utils/config');
class ConfigService {
    register() {
        use('config',config);
    }
}

module.exports = ConfigService;