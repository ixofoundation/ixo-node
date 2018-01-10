"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jayson = require('jayson/promise');
class NetworkRouter {
    /**
     * Initialize the Router
     */
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        let network = {
            "ping": function (args) {
                return new Promise(function (resolve, reject) {
                    resolve('pong');
                });
            }
        };
        this.router.post('network', jayson.server(network).middleware());
    }
}
exports.NetworkRouter = NetworkRouter;
// Create the HeroRouter, and export its configured Express.Router
const networkRoutes = new NetworkRouter();
networkRoutes.init();
exports.default = networkRoutes.router;
