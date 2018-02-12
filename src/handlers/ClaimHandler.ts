import { Claim, IClaimModel, ClaimSchema } from '../model/claim/Claim';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';
import {IxoValidationError} from "../errors/IxoValidationError";
import {TemplateHandler} from "./TemplateHandler";
import {Request} from "../handlers/Request";
import { IClaim } from '../model/claim/IClaim';


declare var Promise: any;

export class ClaimHandler {

  templateHandler: TemplateHandler;

  constructor(){
    this.templateHandler = new TemplateHandler();
  }

  getTemplate = (args: any) => {
    var request = new Request(args);
    if(request.data.type == undefined || request.data.type == "claim"){
      let newArgs = {...args.payload.data,
        type: "claim"
      };
      return this.templateHandler.getTemplate({
                                                payload: {
                                                  data: newArgs
                                                }
                                              });
    }else{
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("Template 'type' must be 'claim'"));
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
          did: args.signature.creator
        };
        return Claim.create(obj);
    })
  }

  listForDID = (args: any) => {
    var request = new Request(args);
    if (request.data.did == undefined){
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("'did' not specified in params"));
      })     
    }
    return this.find({ "did": request.data.did });
  }

  listForProject = (args: any) => {
    var request = new Request(args);
    if (request.data.projectTx == undefined){
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("'projectTx' not specified"))
      })
    }
    return this.find({ "projectTx": request.data.projectTx });
  }

  find = (criteria: any) => {
    return Claim.find(criteria)
      .sort('-created')
      .exec();
  }

}

/*
  updateAgentStatus = (args: any) => {
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
      return Agent.findOne({"tx": obj.agentTx}).then((agent) => {
        if(agent == null){
          return new Promise((resolve: Function, reject: Function) => {
            reject(new IxoValidationError("Agent: '" + obj.agentTx + "' does not exist"))
          });
        }else{
          var agentStatus = new AgentStatus(obj);
          return agentStatus.save().then( (agentStatus: any) => {
            agent.statuses.push(agentStatus);
            agent.latestStatus = agentStatus.status;
            return agent.save();
          })
        }
      });
    });
  }

  list = (args: any) => {
    var request = new Request(args);
    var res = this.find(request.data);
    return res;
  }

  listForDID = (args: any) => {
    var request = new Request(args);
    if (request.data.did == undefined){
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("'did' not specified in params"));
      })     
    }
    return this.find({ "did": request.data.did });
  }
*/



