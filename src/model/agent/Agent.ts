import {Project, IProjectModel} from '../project/Project';
import { Document, Schema, Model, model} from "mongoose";
import { IAgent } from "./IAgent";

import {IxoValidationError} from "../../errors/IxoValidationError";

export interface IAgentModel extends IAgent, Document {
}

export var AGENT_ROLE = Object.freeze({'OA': 'OA', 'SA': 'SA', 'IA': 'IA', 'EA': 'EA'});

export var AgentSchema: Schema = new Schema({
  tx: {
    type: String,
    index: true,
    unique: true // Unique index. 
  },
  created: { 
    type: Date, 
    default: Date.now
  },
  did: {
    type: String,
    required : true,
    index: true
  },
  name: {
    type: String,
    required : true
  },
  email: {
    type: String,
    required : true
  },
  projectTx: {
    type: String,
    index: true,
    required : true
  },
  role: {
    type: String,
    validate: function(role: String){return [AGENT_ROLE.SA,AGENT_ROLE.IA,AGENT_ROLE.EA].indexOf(role.toString())!= -1},
    required : true
  },
  latestStatus: {
    type: String,
    required : true,
    default: 'Pending'
  },
  statuses: [{
      type: Schema.Types.ObjectId,
      ref: 'AgentStatus'
    }
  ]
 }, {strict: false});   // Allow any other fields to also be included over and above the standard ones

 AgentSchema.pre("save", function(this: IAgent, next) {
  validateProject(this.projectTx, (err: Error, ret: boolean) =>{
    if(err){
      next(err);
      return;
    }
    validateAgent(this.projectTx, this.tx, this.did, this.role, (err: Error, ret: boolean) => {
      if(err){
        next(err);
        return;
      }
      next();
    });
  });
 });

export const Agent: Model<IAgentModel> = model<IAgentModel>("Agent", AgentSchema);

// Check that a valid Project TX is supplied
function validateProject(projectTx: String, callback: Function){
  Project.findOne({"tx": projectTx}, (err, proj) => {
    if(proj == null)
      callback(new IxoValidationError("ProjectTx: '" + projectTx + "' is invalid"), null);
    callback(err, true);
  })
}

// Check that the Agen is not already register as that role on the project and 
// ensure the Agent cannot be a SA and a EA on the same project
function validateAgent(projectTx: String, tx: String, did: String, role: String, callback: Function){
  Agent.find({"projectTx": projectTx}, (err, agents) => {
    agents.forEach((agent) => {
      if(agent.tx != tx && agent.did == did && agent.role == role) 
        callback(new IxoValidationError("Agent: '" + did + "' already exists on the project"), null);
      // Ensure agent is not an EA and SA
      if(agent.did == did && ((agent.role == AGENT_ROLE.SA && role == AGENT_ROLE.EA)
          || (agent.role == AGENT_ROLE.EA && role == AGENT_ROLE.SA)) )
        callback(new IxoValidationError('An agent cannot be a Service Agent and an Evaluation agent on the same project'), null);
        return;
    })
    callback(err, true);
  })  
}

