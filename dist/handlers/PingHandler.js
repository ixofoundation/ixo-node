"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PingHandler {
    constructor() {
    }
    process() {
        return function (args) {
            return new Promise(function (resolve, reject) {
                resolve('pong');
            });
        };
    }
}
exports.PingHandler = PingHandler;
