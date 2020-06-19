const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fileUpload = require('express-fileupload');
const Helper = require('../Helper');
class RouterService {

    constructor(app) {
        this.app = app;
    }

    register() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
       
        
        /*
         * route group
         */
        express.application.group = express.Router.group = function(arg1, arg2) {
            var fn, path;
        
            if (arg2 === undefined) {
                path = "/";
                fn = arg1;
            }
            else {
                path = arg1;
                fn = arg2
            }
        
            var router = express.Router();
            fn(router);
            this.use(path, router);
            return router;
        };
    }

    boot() {

        this.app.use('/public',express.static(path.join(Helper.getRootPath(), './public')));

        this.app.use(fileUpload());
    }
}

module.exports = RouterService;