import {Router} from 'express';

import {AbstractRouter} from './AbstractRouter';
import {PingHandler} from '../handlers/PingHandler';

export class NetworkRouter extends AbstractRouter{
  setup() {
    return {
      "ping": new PingHandler().process()
    }
  }

}

// Create the Router, and export its configured Express.Router
export default new NetworkRouter().router;

