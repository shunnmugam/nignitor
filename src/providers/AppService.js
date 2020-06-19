class AppService {
    constructor(app) {
        this.app = app;
    }
    /*
     * register service
     */
    register() {
        //register use global helper
        require('../utils/use');
    }
}


module.exports = AppService;