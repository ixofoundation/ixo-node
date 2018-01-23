import * as logger from '../logger/Logger';

export class IxoValidationError extends Error{
  constructor(message: string){
    super(message);
    console.log(this.stack);
  }

}