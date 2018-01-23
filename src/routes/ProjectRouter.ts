import {Router} from 'express';

import {AbstractRouter} from './AbstractRouter';
import {ProjectHandler} from '../handlers/ProjectHandler';
import * as logger from '../logger/Logger';


var jayson = require('jayson/promise');

declare var Promise: any;

export class ProjectRouter extends AbstractRouter{

  setup() {
    return {

      "getTemplate": function(args: any) {
        return new Promise((resolve: Function, reject: Function) => {
          new ProjectHandler().getTemplate(args)
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
          new ProjectHandler().create(args)
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
          new ProjectHandler().list(args)
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
          new ProjectHandler().listForDID(args)
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
export default new ProjectRouter().router;

