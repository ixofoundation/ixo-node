import {Project, IProjectModel} from '../project/Project';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';
import {TemplateUtils} from '../templates/TemplateUtils';
import {TemplateType} from '../templates/TemplateType';

declare var Promise: any;

export class ProjectHandler {

  templateUtils: TemplateUtils;

  constructor(){
    this.templateUtils = new TemplateUtils();
  }

  getTemplate(args: any){
    if(args.type == "project"){
      return this.templateUtils.getTemplate("projects", args.name);
    }else{
      throw Error("Template 'type' must be 'project'");
    }

  }

  create(args: any) {
    return blockchain.createTransaction(JSON.stringify(args.data), args.signature.type, args.signature.signature, args.signature.creator)
      .then((transaction: ITransactionModel) => {
        // Deep clone the data using JSON
        var obj = JSON.parse(JSON.stringify(args.data));
        obj.tx = transaction.hash;
        obj.owner.did = args.signature.creator;
        return Project.create(obj);
      })
  }

  list(args: any) {
    return Project.find()
      .sort('-created')
      .exec();
    }

}


