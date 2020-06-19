const Helper = require('../Helper');
function config(option, defaultValue) {
    try {
        const optionArray = option.split(".");
        const config = require(Helper.getRootPath() + 'config/'+optionArray[0]);
        let seletedConfig = config;
        for(let i = 1;i <= optionArray.length - 1; i++) {
            seletedConfig = seletedConfig[optionArray[i]]
        }
        if(seletedConfig === undefined) {
            return defaultValue !== undefined ? defaultValue : ''
        }
        return seletedConfig;
    } catch(e) {
        return defaultValue !== undefined ? defaultValue : ''
    }
}

module.exports = config;