/// <reference types="express" />
import { Router } from 'express';
import { AbstractRouter } from './AbstractRouter';
export declare class ProjectRouter extends AbstractRouter {
    setup(): {
        "getTemplate": (args: any) => any;
        "create": (args: any) => any;
        "list": (args: any) => any;
    };
}
declare const _default: Router;
export default _default;
