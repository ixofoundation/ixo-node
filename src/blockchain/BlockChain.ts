import {EventEmitter}  from 'events';
import {ITransactionModel, Transaction} from './models/Transaction';
import {ITransaction} from './models/ITransaction';

declare var Promise: any;

export class BlockChain {

  emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }


  createTransaction(data: String, signature: String, publicKey: String, emit = true): Promise<ITransactionModel>{
    return new Promise(function(resolve: Function, reject: Function){
      Transaction.create(
        {
          "data": data, 
          "signature": signature, 
          "publicKey": publicKey
        }, function(error: Error, newTransaction: ITransactionModel){
         if(error){
           reject(error);
         }else{
           resolve(newTransaction);
         }
      });
    });
  }

}

export default new BlockChain();