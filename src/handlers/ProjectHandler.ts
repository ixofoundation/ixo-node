import {Project, IProjectModel} from '../model/project/Project';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';
import {TemplateUtils} from '../templates/TemplateUtils';
import {IxoValidationError} from "../errors/IxoValidationError";


declare var Promise: any;

export class ProjectHandler {

  templateUtils: TemplateUtils;

  constructor(){
    this.templateUtils = new TemplateUtils();
  }

  getTemplate(args: any){
    if(args.type == undefined || args.type == "project"){
      return this.templateUtils.getTemplate("projects", args.name);
    }else{
      throw new IxoValidationError("Template 'type' must be 'project'");
    }

  }

  create(args: any) {
    return blockchain.createTransaction(JSON.stringify(args.data), args.signature.type, args.signature.signature, args.signature.creator)
      .then((transaction: ITransactionModel) => {
        // Deep clone the data using JSON
        var obj = {...args.data,
          tx: transaction.hash,
          owner: {...args.data.owner,
            did: args.signature.creator}
        }
        return Project.create(obj);
      })
  }

  list(args: any) {
    return Project.find(args)
      .sort('-created')
      .exec();
  }

  listForDID(args: any) {
    if(args.did == undefined) throw Error("'did' not specified");
    return Project.find({"owner.did": args.did})
      .sort('-created')
      .exec();
  }


}


