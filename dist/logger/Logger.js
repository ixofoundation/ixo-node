"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressWinston = require("express-winston");
const winston = require("winston");
var consoleTransport = new winston.transports.Console({
    timestamp: true,
    json: false,
    colorize: true
});
winston.configure({
    transports: [
        consoleTransport
    ]
});
exports.base = winston;
exports.before = expressWinston.logger({
    winstonInstance: winston
});
exports.after = expressWinston.errorLogger({
    winstonInstance: winston
});
