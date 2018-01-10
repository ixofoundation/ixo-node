"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("./logger/Logger");
const bodyParser = require("body-parser");
const NetworkRouter_1 = require("./routes/NetworkRouter");
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
        this.express.use(logger.before);
    }
    // Configure API endpoints.
    routes() {
        this.express.get('/', (req, res, next) => {
            res.send('API is running');
        });
        this.express.use('/api/network', NetworkRouter_1.default);
        this.express.use(logger.after);
    }
}
exports.default = new App().express;
