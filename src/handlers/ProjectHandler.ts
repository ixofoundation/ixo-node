import {Project, IProjectModel} from '../model/project/Project';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';
import {IxoValidationError} from "../errors/IxoValidationError";
import {TemplateHandler} from "./TemplateHandler";
import {Request} from "./Request";


declare var Promise: any;

export class ProjectHandler {

  templateHandler: TemplateHandler;

  constructor(){
    this.templateHandler = new TemplateHandler();
  }

  getTemplate = (args: any) => {
    var request = new Request(args);
    if(request.data.type == undefined || request.data.type == "project"){
      let newArgs = {...args.payload.data,
        type: "project"
      };
      return this.templateHandler.getTemplate({
                                                payload: {
                                                  data: newArgs
                                                }
                                              });
    }else{
      throw new IxoValidationError("Template 'type' must be 'project'");
    }
  }

  create = (args: any) => {
    return new Promise((resolve: Function, reject: Function) => {
      var request = new Request(args);
      if(request.verifySignature()){
        resolve(request);
      }
    }).then( (request: Request) => {
      console.log("About to save tran");
      return blockchain.createTransaction(request.payload, request.signature.type, request.signature.signature, request.signature.creator)
    }).then((transaction: ITransactionModel) => {
        // Deep clone the data using JSON
        var obj = {...args.payload.data,
          tx: transaction.hash,
          owner: {...args.payload.data.owner,
            did: args.signature.creator}
        }
        console.log("About to save proj");
        return Project.create(obj);
      })
  }

  list = (args: any) => {
    var request = new Request(args);
    return Project.find(request.data)
      .sort('-created')
      .exec();
  }

  listForDID = (args: any) => {
    var request = new Request(args);
    if(request.data.did == undefined) throw Error("'did' not specified");
    return Project.find({"owner.did": request.data.did})
      .sort('-created')
      .exec();
  }


}


