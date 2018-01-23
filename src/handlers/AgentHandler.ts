import { Agent, IAgentModel } from '../model/agent/Agent';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';
import { TemplateUtils } from '../templates/TemplateUtils';

declare var Promise: any;

export class AgentHandler {

  templateUtils: TemplateUtils;

  constructor() {
    this.templateUtils = new TemplateUtils();
  }

  getTemplate(args: any) {
    if (args.type == undefined || args.type == "agent") {
      return this.templateUtils.getTemplate("agents", args.name);
    } else {
      throw Error("Template 'type' must be 'agent'");
    }

  }

  create(args: any) {
    return blockchain.createTransaction(JSON.stringify(args.data), args.signature.type, args.signature.signature, args.signature.creator)
      .then((transaction: ITransactionModel) => {
        // Deep clone the data using JSON
        var obj = {
          ...args.data,
          tx: transaction.hash,
          did: args.signature.creator
        };
        return Agent.create(obj);
      })
  }

  list(args: any) {
    return Agent.find(args)
      .sort('-created')
      .exec();
  }

  listForDID(args: any) {
    if (args.did == undefined) throw Error("'did' not specified");
    return Agent.find({ "did": args.did })
      .sort('-created')
      .exec();
  }

  listForProject(args: any) {
    if (args.did == undefined) throw Error("'projectTx' not specified");
    return Agent.find({ "projectTx": args.projectTx })
      .sort('-created')
      .exec();
  }


}


