const dotEnv = require('dotenv');
const path = require('path');
const env = require('../utils/env');
const Helper = require('../Helper');
class EnvService {
    register() {
        var nodeEnv = process.env.NODE_ENV;
        if (nodeEnv)
            dotEnv.config({ path: path.join(Helper.getRootPath(), `.env.${process.env.NODE_ENV}`) });
        else
            dotEnv.config({ path: path.join(Helper.getRootPath(), '.env') }); //development
        
        use('env',env);
    }

    boot() {
        
    }
}

module.exports = EnvService;