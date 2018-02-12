import {EventEmitter}  from 'events';
import {ITransactionModel, Transaction} from './models/Transaction';
import {ITransaction} from './models/ITransaction';

declare var Promise: any;

/*
Complete Stub of a blockchain simply here to create a transaction id
 */

export class BlockChain {

  emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }


  createTransaction(data: String, signatureType: String, signature: String, publicKey: String, emit = true): Promise<ITransactionModel>{
    return new Promise(function(resolve: Function, reject: Function){
      Transaction.create(
        {
          "data": data, 
          "signatureType": signatureType,
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