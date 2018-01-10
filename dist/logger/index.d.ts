/// <reference types="express" />
import express = require('express');
import winston = require('winston');
export declare let ixoLoggers: {
    default: winston.Winston;
    before: express.Handler;
    after: express.ErrorRequestHandler;
};
