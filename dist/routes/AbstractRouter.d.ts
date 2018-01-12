/// <reference types="express" />
import { Router } from 'express';
export declare abstract class AbstractRouter {
    router: Router;
    /**
     * Initialize the Router
     */
    constructor();
    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init(): void;
    setup(): void;
}
