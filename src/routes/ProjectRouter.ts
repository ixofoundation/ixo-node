import {Router} from 'express';

import {AbstractRouter} from './AbstractRouter';
import {ProjectHandler} from '../handlers/ProjectHandler';
import * as logger from '../logger/Logger';


var jayson = require('jayson/promise');

declare var Promise: any;

export class ProjectRouter extends AbstractRouter{

  setup() {
    let config = {};

    const handler = new ProjectHandler();
    this.register(config, "getTemplate", handler.getTemplate);
    this.register(config, "create", handler.create);
    this.register(config, "list", handler.list);
    this.register(config, "listForDID", handler.listForDID);

    return config;
  }

}

// Create the Router, and export its configured Express.Router
export default new ProjectRouter().router;

