import { Claim, IClaimModel, ClaimSchema } from '../model/claim/Claim';
import { Project, IProjectModel, ProjectSchema } from '../model/project/Project';
import { Evaluation, IEvaluationModel, EvaluationSchema } from '../model/claim/Evaluation';
import {Agent, IAgentModel} from '../model/agent/Agent';
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

  getEvaluationTemplate = (args: any) => {
    var request = new Request(args);
    if(request.data.type == undefined || request.data.type == "evaluation"){
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
        reject(new IxoValidationError("Template 'type' must be 'evaluation'"));
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
      //Validate the new Claim
      return new Promise((resolve: Function, reject: Function) => {
        // Check that a valid Project TX is supplied
        Agent.findOne({did: request.did, role: 'SA', projectTx: request.data.projectTx}, (err, agent) => {
          if(agent == null){
            reject(new IxoValidationError("ProjectTx: '" + request.data.projectTx + "' The agent did: '" + request.did + "' is invalid"));
          }else{
            resolve(request);
          }
        })
      })
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

  evaluateClaim = (args: any) => {
    return new Promise((resolve: Function, reject: Function) => {
      var request = new Request(args);
      if(request.verifySignature()){
        resolve(request);
      }
    }).then( (request: Request) => {
      //Validate the status change
      return new Promise((resolve: Function, reject: Function) => {
        // Check that the agent making this update is a EA on the project
        Claim.findOne({"tx": request.data.claimTx}, (err, claim) => {
          if(claim != null){
            // Check that the agent making the evaluation is a EA on this project
            Agent.findOne({did: request.did, projectTx: claim.projectTx, role: 'EA'}, (err, agent) => {
              if(agent){
                resolve(request);
              }else{
                reject(new IxoValidationError("Only the Evaluation agents on project can evaluate claims"));
                return;
              }
            })
          }else{
            reject(new IxoValidationError("Claim: '" + request.data.claimTx + "' does not exist"));
            return;
          }
        })
      })
    }).then( (request: Request) => {
      return blockchain.createTransaction(request.payload, request.signature.type, request.signature.signature, request.signature.creator)
    }).then((transaction: ITransactionModel) => {
      // Deep clone the data using JSON
      var obj = {...args.payload.data,
        tx: transaction.hash,
        did: args.signature.creator
      };
      return Claim.findOne({"tx": obj.claimTx}).then((claim) => {
        if(claim == null){
          return new Promise((resolve: Function, reject: Function) => {
            reject(new IxoValidationError("Claim: '" + obj.claimTx + "' does not exist"))
          });
        }else{
          var evaluation = new Evaluation(obj);
          return evaluation.save().then( (evaluation: any) => {
            claim.evaluations.push(evaluation);
            claim.latestEvaluation = evaluation.result;
            return claim.save();
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

  listForProject = (args: any) => {
    var request = new Request(args);
    if (request.data.projectTx == undefined){
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("'projectTx' not specified"))
      })
    }
    return this.find({ "projectTx": request.data.projectTx });
  }

  listForProjectAndStatus = (args: any) => {
    var request = new Request(args);
    if (request.data.projectTx == undefined){
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("'projectTx' not specified"))
      })
    }
    return this.find({ "projectTx": request.data.projectTx, latestEvaluation: request.data.status  });
  }

  listForProjectAndDID = (args: any) => {
    var request = new Request(args);
    if (request.data.projectTx == undefined){
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("'projectTx' not specified"))
      })
    }
    return this.find({ "projectTx": request.data.projectTx, did: request.data.did  });
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



