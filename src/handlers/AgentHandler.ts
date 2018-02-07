import { Agent, IAgentModel } from '../model/agent/Agent';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';
import {IxoValidationError} from "../errors/IxoValidationError";
import {TemplateHandler} from "./TemplateHandler";
import {Request} from "../handlers/Request";

declare var Promise: any;

export class AgentHandler {

  templateHandler: TemplateHandler;

  constructor(){
    this.templateHandler = new TemplateHandler();
  }

  getTemplate = (args: any) => {
    var request = new Request(args);
    if(request.data.type == undefined || request.data.type == "agent"){
      let newArgs = {...args.payload.data,
        type: "agent"
      };
      return this.templateHandler.getTemplate({
                                                payload: {
                                                  data: newArgs
                                                }
                                              });
    }else{
      throw new IxoValidationError("Template 'type' must be 'agent'");
    }
  }

  create = (args: any) => {
    return new Promise((resolve: Function, reject: Function) => {
      var request = new Request(args);
      if(request.verifySignature()){
        resolve(request);
      }
    }).then( (request: Request) => {
      return blockchain.createTransaction(request.payload, request.signature.type, request.signature.signature, request.signature.creator)
    }).then((transaction: ITransactionModel) => {
        // Deep clone the data using JSON
        var obj = {...args.payload.data,
          tx: transaction.hash,
          did: args.signature.creator
        };
        return Agent.create(obj);
      })
  }

  list = (args: any) => {
    var request = new Request(args);
    return Agent.find(request.data)
      .sort('-created')
      .exec();
  }

  listForDID = (args: any) => {
    var request = new Request(args);
    if (request.data.did == undefined) throw Error("'did' not specified");
    return Agent.find({ "did": request.data.did })
      .sort('-created')
      .exec();
  }

  listForProject = (args: any) => {
    var request = new Request(args);
    if (request.data.did == undefined) throw Error("'projectTx' not specified");
    return Agent.find({ "projectTx": request.data.projectTx })
      .sort('-created')
      .exec();
  }


}


