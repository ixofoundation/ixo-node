/// <reference types="express" />
import { Router } from 'express';
import { AbstractRouter } from './AbstractRouter';
export declare class NetworkRouter extends AbstractRouter {
    setup(): {
        "ping": (args: any) => any;
    };
}
declare const _default: Router;
export default _default;
