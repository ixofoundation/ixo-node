import {Project, IProjectModel} from '../model/project/Project';
import {Agent, IAgentModel} from '../model/agent/Agent';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';
import {IxoValidationError} from "../errors/IxoValidationError";
import {TemplateHandler} from "./TemplateHandler";
import {Request} from "./Request";
const dot = require("dot-object");

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
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("Template 'type' must be 'project'"));
      })
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
        }
        dot.set('owner.did', args.signature.creator, obj);
        return Project.create(obj);
      })
  }

  list = (args: any) => {
    var request = new Request(args);
    return this.find(request.data);
  }

  listForDID = (args: any) => {
    var request = new Request(args);
    if(request.data.did == undefined){
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("'did' not specified in params"));
      })
    }else{
      return this.find({"owner.did": request.data.did});
    }
  }

  listForAgentDIDAndRole = (args: any) => {
    var request = new Request(args);
    if(request.data.did == undefined){
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("'did' not specified in params"));
      })
    }else if(request.data.role == undefined){
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("'role' not specified in params"));
      })
    }

    return Agent.find(
      {
        did:request.data.did, 
        role:request.data.role
      }).then((agents)=> agents.map(function(a){return a.projectTx}))
      .then((projectTxs) => this.find({'tx': {$in: projectTxs}}))
  }

  find = (criteria: any) => {
    return Project.find(criteria)
      .sort('-created')
      .exec();
  }



}


