import {Router} from 'express';

import {AbstractRouter} from './AbstractRouter';
import {TemplateHandler} from '../handlers/TemplateHandler';
import * as logger from '../logger/Logger';


var jayson = require('jayson/promise');

declare var Promise: any;

export class TemplateRouter extends AbstractRouter{

  setup() {
    return {

      "getTemplate": function(args: any) {
        return new Promise((resolve: Function, reject: Function) => {
          new TemplateHandler().getTemplate(args)
            .then(
              (data) => resolve(data))
            .catch( (err: Error) => {
              logger.base.error(err.message, err); 
              reject(jayson.server().error(null, err.message))
            });
        })
      },
    }
  }
}

// Create the Router, and export its configured Express.Router
export default new TemplateRouter().router;

