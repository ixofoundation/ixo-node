import {Router} from 'express';
import {AbstractRouter} from './AbstractRouter';
import {ClaimHandler} from '../handlers/ClaimHandler';

declare var Promise: any;

export class ClaimRouter extends AbstractRouter{

  setup() {
    let config = {};

    const handler = new ClaimHandler();
    this.register(config, "getTemplate", handler.getTemplate);
    this.register(config, "create", handler.create);
//    this.register(config, "updateClaimStatus", handler.updateClaimStatus);
    this.register(config, "listForDID", handler.listForDID);
    this.register(config, "listForProject", handler.listForProject);

    return config;
  }

}

// Create the Router, and export its configured Express.Router
export default new ClaimRouter().router;

