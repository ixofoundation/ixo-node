import { Document, Schema, Model } from "mongoose";
import { ITransaction } from "./ITransaction";
export interface ITransactionModel extends ITransaction, Document {
    validateTransaction(): boolean;
}
export declare var TransactionSchema: Schema;
export declare const Transaction: Model<ITransactionModel>;
