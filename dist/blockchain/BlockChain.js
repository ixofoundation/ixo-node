"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Transaction_1 = require("./models/Transaction");
class BlockChain {
    constructor() {
        this.emitter = new events_1.EventEmitter();
    }
    createTransaction(data, signatureType, signature, publicKey, emit = true) {
        return new Promise(function (resolve, reject) {
            Transaction_1.Transaction.create({
                "data": data,
                "signatureType": signatureType,
                "signature": signature,
                "publicKey": publicKey
            }, function (error, newTransaction) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(newTransaction);
                }
            });
        });
    }
}
exports.BlockChain = BlockChain;
exports.default = new BlockChain();
