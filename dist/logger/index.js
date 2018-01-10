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
var defaultLogger = winston;
var beforeLogger = expressWinston.logger({
    winstonInstance: winston
});
var afterLogger = expressWinston.errorLogger({
    winstonInstance: winston
});
/*
export let ixoLoggers = {
  default: defaultLogger,
  before: beforeLogger,
  after: afterLogger
};
*/
exports.base = defaultLogger;
exports.before = beforeLogger;
exports.after = afterLogger;
