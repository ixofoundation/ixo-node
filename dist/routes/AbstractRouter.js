"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jayson = require('jayson/promise');
class AbstractRouter {
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
        this.router.post('/', jayson.server(this.setup()).middleware());
    }
    setup() { }
}
exports.AbstractRouter = AbstractRouter;
