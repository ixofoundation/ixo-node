import {Router} from 'express';

import {AbstractRouter} from './AbstractRouter';
import {TemplateHandler} from '../handlers/TemplateHandler';
import * as logger from '../logger/Logger';


var jayson = require('jayson/promise');

declare var Promise: any;

export class TemplateRouter extends AbstractRouter{

  setup() {
    let config = {};

    const handler = new TemplateHandler();
    this.register(config, "getTemplate", handler.getTemplate);

    return config;
  }
}

// Create the Router, and export its configured Express.Router
export default new TemplateRouter().router;

