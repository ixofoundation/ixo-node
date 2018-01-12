/// <reference types="express" />
import * as express from 'express';
import * as winston from 'winston';
export declare let base: winston.Winston;
export declare let before: express.Handler;
export declare let after: express.ErrorRequestHandler;
