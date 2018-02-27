import { Project, IProjectModel, ProjectSchema } from '../model/project/Project';
import { Agent, IAgentModel, AgentSchema, AGENT_ROLE } from '../model/agent/Agent';
import { AgentStatus, IAgentStatusModel, AGENT_STATUS } from '../model/agent/AgentStatus';
import { IAgentStatus } from '../model/agent/IAgentStatus';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';
import {IxoValidationError} from "../errors/IxoValidationError";
import {TemplateHandler} from "./TemplateHandler";
import {Request} from "../handlers/Request";
import { IAgent } from '../model/agent/IAgent';


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
      return new Promise((resolve: Function, reject: Function) => {
        reject(new IxoValidationError("Template 'type' must be 'agent'"));
      })
    }
  }

  create = (args: any) => {
    var request = new Request(args);
    return new Promise((resolve: Function, reject: Function) => {
      //Verify the signature
      if(request.verifySignature()){
        resolve(request);
      }
    })
    .then( (request: Request) => {
      //Validate the new Agent
      return new Promise((resolve: Function, reject: Function) => {
        // Check that a valid Project TX is supplied
        Project.findOne({"tx": request.data.projectTx}, (err: any, proj:any) => {
          if(proj == null){
            reject(new IxoValidationError("ProjectTx: '" + request.data.projectTx + "' is invalid"));
          }else{
            // Check that the Agent is not already registered as that role on the project and 
            // ensure the Agent cannot be a SA and a EA on the same project
            Agent.find({"projectTx": request.data.projectTx, "did": request.did}, (err, agents) => {
              var role = request.data.role;
              agents.forEach((agent) => {
                if(agent.role == role) {
                  reject(new IxoValidationError("Agent: '" + request.did + "' already exists on the project"));
                  return
                }
                  // Ensure agent is not an EA and SA
                if((agent.role == AGENT_ROLE.SA && role == AGENT_ROLE.EA)
                    || (agent.role == AGENT_ROLE.EA && role == AGENT_ROLE.SA)) {
                  reject(new IxoValidationError('An agent cannot be a Service Agent and an Evaluation agent on the same project'));
                  return
                }
              })
              // Sets the Status of the Agent
              var latestStatus = AGENT_STATUS.Pending;
              if(proj.autoApproveInvestmentAgent && role == AGENT_ROLE.IA){
                latestStatus = AGENT_STATUS.Approved;
              }else if(proj.autoApproveServiceAgent && role == AGENT_ROLE.SA){
                latestStatus = AGENT_STATUS.Approved;
              }else if(proj.autoApproveEvaluationAgent && role == AGENT_ROLE.EA){
                latestStatus = AGENT_STATUS.Approved;
              }
              resolve({...request, 'latestStatus': latestStatus});
            })
          }
        })
      })
    })
    .then( (request: Request) => {
      return blockchain.createTransaction(request.payload, request.signature.type, request.signature.signature, request.signature.publicKey)
    }).then((transaction: ITransactionModel) => {
        // Deep clone the data using JSON
        var obj = {...args.payload.data,
          tx: transaction.hash,
          did: args.signature.creator
        };
        return Agent.create(obj);
    })
  }

  updateAgentStatus = (args: any) => {
    return new Promise((resolve: Function, reject: Function) => {
      var request = new Request(args);
      if(request.verifySignature()){
        resolve(request);
      }
    }).then( (request: Request) => {
      //Validate the status change
      return new Promise((resolve: Function, reject: Function) => {
        // Check that the project owner is making this update
        Agent.findOne({"tx": request.data.agentTx}, (err, agent) => {
          if(agent != null){
            Project.findOne({"tx": agent.projectTx}, (err, project) => {
              if(project && project.owner.did == request.did){
                resolve(request);
              }else{
                reject(new IxoValidationError("Only the project owner can update an agents status"));
                return;
              }
            })
          }else{
            reject(new IxoValidationError("Agent: '" + request.data.agentTx + "' does not exist"));
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
    return Agent.find(criteria)
      .sort('-created')
      .exec();
  }

}


