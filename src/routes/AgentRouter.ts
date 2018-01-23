import {Router} from 'express';

import {AbstractRouter} from './AbstractRouter';
import {AgentHandler} from '../handlers/AgentHandler';
import * as logger from '../logger/Logger';


var jayson = require('jayson/promise');

declare var Promise: any;

export class AgentRouter extends AbstractRouter{

  setup() {
    return {

      "getTemplate": function(args: any) {
        return new Promise((resolve: Function, reject: Function) => {
          new AgentHandler().getTemplate(args)
            .then(
              (data) => resolve(data))
            .catch( (err: Error) => {
              logger.base.error(err.message, err); 
              reject(jayson.server().error(null, err.message))
            });
        })
      },

      "create": function(args: any) {
        return new Promise((resolve: Function, reject: Function) => {
          new AgentHandler().create(args)
            .then(
              (data) => resolve(data))
            .catch( (err: Error) => {
              logger.base.error(err.message, err); 
              reject(jayson.server().error(null, err.message))
            });
        })
      },

      "list": function(args: any) {
        return new Promise((resolve: Function, reject: Function) => {
          new AgentHandler().list(args)
            .then(
              (data) => resolve(data))
            .catch( (err: Error) => {
              logger.base.error(err.message, err); 
              reject(jayson.server().error(null, err.message))
            });
        })

      },

      "listForDID": function(args: any) {
        return new Promise((resolve: Function, reject: Function) => {
          new AgentHandler().listForDID(args)
            .then(
              (data) => resolve(data))
            .catch( (err: Error) => {
              logger.base.error(err.message, err); 
              reject(jayson.server().error(null, err.message))
            });
        })

      },

      "listForProject": function(args: any) {
        return new Promise((resolve: Function, reject: Function) => {
          new AgentHandler().listForProject(args)
            .then(
              (data) => resolve(data))
            .catch( (err: Error) => {
              logger.base.error(err.message, err); 
              reject(jayson.server().error(null, err.message))
            });
        })

      }
    }
  }

}

// Create the Router, and export its configured Express.Router
export default new AgentRouter().router;

