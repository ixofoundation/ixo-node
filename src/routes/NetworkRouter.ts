import {Router} from 'express';

import {AbstractRouter} from './AbstractRouter';
import {PingHandler} from '../handlers/PingHandler';

declare var Promise: any;

export class NetworkRouter extends AbstractRouter{

  

  setup() {
    let config = {
    };

    this.register(config, "ping", new PingHandler().process);

    return config;
  }
}

// Create the Router, and export its configured Express.Router
export default new NetworkRouter().router;

