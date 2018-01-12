import {Project, IProjectModel} from '../project/Project';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';

declare var Promise: any;

export class ProjectHandler {

  create(args: any) {
    return blockchain.createTransaction(JSON.stringify(args.data), args.signature.sign, args.signature.publicKey)
      .then((transaction: ITransactionModel) => {
        return Project.create({
          "tx": transaction.hash,
          "name": args.data.name,
          "owner": args.data.owner
        })
      })
  }

  list(args: any) {
    return Project.find()
      .sort('-created')
      .exec();
    }

}


