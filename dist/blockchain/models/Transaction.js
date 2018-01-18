"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionError_1 = require("./TransactionError");
const CryptoUtils_1 = require("../../utils/CryptoUtils");
var cryptoUtils = new CryptoUtils_1.default();
exports.TransactionSchema = new mongoose_1.Schema({
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
exports.TransactionSchema.pre("save", function (next) {
    if (!cryptoUtils.validateSignature(this.data, this.signatureType, this.signature, this.publicKey)) {
        throw new TransactionError_1.TransactionError("Invalid transaction input signature '" + this.data);
    }
    this.nonce = cryptoUtils.createNonce();
    this.hash = cryptoUtils.hash(this.nonce.toString() + this.type + this.data);
    next();
});
exports.TransactionSchema.methods.validateTransaction = function () {
    if (!cryptoUtils.validateSignature(this.data, this.signatureType, this.signature, this.publicKey)) {
        throw new TransactionError_1.TransactionError("Invalid transaction input signature '" + this.data);
    }
    return true;
};
exports.Transaction = mongoose_1.model("Transaction", exports.TransactionSchema);
