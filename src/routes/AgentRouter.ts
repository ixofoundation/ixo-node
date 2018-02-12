import {Router} from 'express';
import {AbstractRouter} from './AbstractRouter';
import {AgentHandler} from '../handlers/AgentHandler';

declare var Promise: any;

export class AgentRouter extends AbstractRouter{

  setup() {
    let config = {};

    const handler = new AgentHandler();
    this.register(config, "getTemplate", handler.getTemplate);
    this.register(config, "create", handler.create);
    this.register(config, "updateAgentStatus", handler.updateAgentStatus);
    this.register(config, "list", handler.list);
    this.register(config, "listForDID", handler.listForDID);
    this.register(config, "listForProject", handler.listForProject);

    return config;
  }

}

// Create the Router, and export its configured Express.Router
export default new AgentRouter().router;

