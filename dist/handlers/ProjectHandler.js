"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = require("../project/Project");
const BlockChain_1 = require("../blockchain/BlockChain");
class ProjectHandler {
    create(args) {
        return BlockChain_1.default.createTransaction(JSON.stringify(args.data), args.signature.sign, args.signature.publicKey)
            .then((transaction) => {
            return Project_1.Project.create({
                "tx": transaction.hash,
                "name": args.data.name,
                "owner": args.data.owner
            });
        });
    }
    list(args) {
        return Project_1.Project.find()
            .sort('-created')
            .exec();
    }
}
exports.ProjectHandler = ProjectHandler;
