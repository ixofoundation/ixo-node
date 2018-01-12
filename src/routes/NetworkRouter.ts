import {Router} from 'express';

import {AbstractRouter} from './AbstractRouter';
import {PingHandler} from '../handlers/PingHandler';

declare var Promise: any;

export class NetworkRouter extends AbstractRouter{
  setup() {
    return {
      "ping": function(args: any) {
        return new Promise((resolve: Function, reject: Function) => {
          resolve(new PingHandler().process(args));
        });
      }
    }
  }

}

// Create the Router, and export its configured Express.Router
export default new NetworkRouter().router;

