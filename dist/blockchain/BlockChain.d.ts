/// <reference types="node" />
import { EventEmitter } from 'events';
import { ITransactionModel } from './models/Transaction';
export declare class BlockChain {
    emitter: EventEmitter;
    constructor();
    createTransaction(data: String, signatureType: String, signature: String, publicKey: String, emit?: boolean): Promise<ITransactionModel>;
}
declare const _default: BlockChain;
export default _default;
