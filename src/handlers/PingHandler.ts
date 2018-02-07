import {Request} from "../handlers/Request";

declare var Promise: any;

export class PingHandler {

  process = (args: any) => {
    return new Promise((resolve: Function, reject: Function) => {
      resolve("pong")
    });
  }

}


