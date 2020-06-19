const server = require('./bin/server');
const express = require('express');

const Helper = require('./Helper');
const Bootstrap = require('./bootstrap/start');

/*
 *
 */
class Nignator {

    constructor(appName) {
        /*
         * application name
         */
        this.appName = appName;
        /*
         * app root folder path
         */
        this.appRoot = '';

        this.beforeHttpCallback;
        this.afterHttpCallback;

        this.afterProviderCallback;

        /*
         * app instance
         */
        this.app = express();

        /*
         * server instance
         */
        this.server;

        this.bootstrap = new Bootstrap(this.app, this.appRoot);
    }

    /*
     * set app root folder
     */
    setAppRoot(appRoot) {
        this.appRoot = appRoot;
        Helper.rootPath = appRoot;
        return this;
    }

    /*
     * append providers
     */
    appendProviders(services) {
        this.bootstrap.appendProviders(services)
        return this;
    }

    /*
     * initiate provider
     */
    initiateProviders() {
        this.bootstrap.register(this.appRoot)
        if(this.afterProviderCallback) {
            this.afterProviderCallback(this.bootstrap, this.app);
        }
        return this;
    }

    /*
     * after provider initiated
     */
    afterProviderInitiate(callBack) {
        this.afterProviderCallback = callBack;
        return this;
    }

    beforeHttp(callBack) {
        this.beforeHttpCallback = callBack;
        return this;
    }

    startServer() {

        if(this.beforeHttpCallback) {
            this.beforeHttpCallback(this.app);
        }

        this.server = server(this.app);

        if(this.afterHttpCallback) {
            this.afterHttpCallback(this.app, this.server);
        }
    }

    afterHttp(callBack) {
        this.afterHttpCallback = callBack;
        return this;
    }
}

module.exports = Nignator;