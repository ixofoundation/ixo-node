import {Router, Request, Response, NextFunction} from 'express';
const jayson = require('jayson/promise');

import {PingHandler} from '../handlers/PingHandler';


export abstract class AbstractRouter {
  router: Router

  /**
   * Initialize the Router
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/', jayson.server(this.setup()).middleware());
  }

  setup(){
  }

}

