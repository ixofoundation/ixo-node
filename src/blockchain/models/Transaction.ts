import { Document, Schema, Model, model} from "mongoose";
import {TransactionError} from './TransactionError';
import { ITransaction } from "./ITransaction";

import cryptoUtils from '../../utils/crypto'

export interface ITransactionModel extends ITransaction, Document {
  validateTransaction(): boolean;
}

export var TransactionSchema: Schema = new Schema({
  data: String,
  hash: {
    type: String,
    index: true,
    unique: true // Unique index. 
  },
  nonce: String,
  type: String,
  signatureType: String,
  signature: String,
  publicKey: String
 });

TransactionSchema.pre("save", function(this: ITransaction, next) {
  if(!cryptoUtils.validateSignature(this.data, this.signatureType, this.signature, this.publicKey)){
      throw new TransactionError("Invalid transaction input signature '" + this.data);
  }
  this.nonce = cryptoUtils.createNonce();
  this.hash = cryptoUtils.hash(this.nonce.toString() + this.type + this.data)
  next();
});

TransactionSchema.methods.validateTransaction = function(): boolean {
  if(!cryptoUtils.validateSignature(this.data, this.signatureType, this.signature, this.publicKey)){
    throw new TransactionError("Invalid transaction input signature '" + this.data);
  }
  return true;
};

export const Transaction: Model<ITransactionModel> = model<ITransactionModel>("Transaction", TransactionSchema);
