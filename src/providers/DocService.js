const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require('path');
const Helper = require('../Helper');

class DocService {
    constructor(app) {
        this.app = app;
    }

    register() {
        const options = {
            swaggerDefinition: {
                openapi: "3.0.0",
                info: {
                    title: "Time to document that Express API you built",
                    version: "1.0.0",
                    description:
                    "A test project to understand how easy it is to document and Express API",
                    license: {
                    name: "MIT",
                    url: "https://choosealicense.com/licenses/mit/"
                    },
                    contact: {
                    name: "Swagger",
                    url: "https://swagger.io",
                    email: "Info@SmartBear.com"
                    }
                },
                servers: [
                    {
                    url: `/`
                    }
                ]
            },
            apis: [path.join(Helper.getRootPath(), `app/routes/*.js`)]
        };
        const specs = swaggerJsdoc(options);
        this.app.use("/docs", swaggerUi.serve);
        this.app.get("/docs",swaggerUi.setup(specs, {
            explorer: true
        }));
    }
}

module.exports = DocService;