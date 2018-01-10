declare var Promise: any;

export class PingHandler {

  constructor() {
  }

  process() {
    return function(args: any){
      return new Promise(function(resolve: Function, reject: Function) {
        resolve('pong');
      });
    }
  }

}


