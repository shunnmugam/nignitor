class Bootstrap {
    /*
     *
     */
    constructor(app) {
        /*
         * list of services
         */
        this.services = {
            'app'       : require('../providers/AppService'),
            'env'       : require('../providers/EnvService'),
            'config'    : require('../providers/ConfigService'),
            'context'   : require('../providers/ContextService'),
            'logger'    : require('../providers/LoggerService'),
            'cors'      : require('../providers/CorsService'),
            'router'    : require('../providers/RouterService'),
            'docs'      : require('../providers/DocService'),
            'error'     : require('../providers/ErrorHandlerService'),
        }
        this.app = app;
        this.servicesObjMap = {};
    }

    appendProviders(services) {
        for (const name in services) {
            if (this.services.hasOwnProperty(name)) {
                if(this.services[name] === undefined) {
                    this.services[name] = require(this.appRoot + "/app/providers/"+services[name])
                } else {
                    throw Error('provider ' + name + 'alerady available, please change provider name')
                }
            }
        }
    }

    /*
     * register service
     */
    register(appRoot) {
        this.appRoot = appRoot;
        for (const name in this.services) {
            if (this.services.hasOwnProperty(name)) {
                const className = this.services[name];
                const obj = new className(this.app);
                this.servicesObjMap[name] = obj;
                if(obj.register)
                    obj.register();
            }
        }
        
        this.boot();
    }

    /*
     * boot
     */
    boot() {
        for (const key in this.servicesObjMap) {
            if (this.servicesObjMap.hasOwnProperty(key)) {
                const obj = this.servicesObjMap[key];
                if(obj.boot)
                    obj.boot();
            }
        }
    }

}

module.exports = Bootstrap;