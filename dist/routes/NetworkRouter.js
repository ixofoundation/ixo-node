"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRouter_1 = require("./AbstractRouter");
const PingHandler_1 = require("../handlers/PingHandler");
class NetworkRouter extends AbstractRouter_1.AbstractRouter {
    setup() {
        return {
            "ping": new PingHandler_1.PingHandler().process()
        };
    }
}
exports.NetworkRouter = NetworkRouter;
// Create the Router, and export its configured Express.Router
exports.default = new NetworkRouter().router;
