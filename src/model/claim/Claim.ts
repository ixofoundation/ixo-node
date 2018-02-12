import { Document, Schema, Model, model} from "mongoose";
import {Agent, IAgentModel} from '../agent/Agent';

import { IClaim } from "./IClaim";

import {IxoValidationError} from "../../errors/IxoValidationError";

export interface IClaimModel extends IClaim, Document {
}

export var ClaimSchema: Schema = new Schema({
  tx: {
    type: String,
    index: true,
    unique: true // Unique index. 
  },
  created: { 
    type: Date, 
    default: 
    Date.now
  },
  did: {
    type: String,
    required : true,
    index: true
  },
  location:{ 
    longitude: { type: Number },
    latitude: { type: Number }
  }
}, {strict: false});   // Allow any other fields to also be included over and above the standard ones

ClaimSchema.pre("save", function(this: IClaim, next) {
  validateAgent(this.did, this.projectTx, (err: Error, ret: boolean) =>{
    if(err){
      next(err);
      return;
    }
    next();
  })
});

// Check that a valid Project TX is supplied
function validateAgent(did: String, projectTx: String, callback: Function){
  Agent.findOne({"did": did, role: 'SA', projectTx: projectTx}, (err, agent) => {
    if(agent == null)
      callback(new IxoValidationError("ProjectTx: '" + projectTx + "' The agent did: '" + did + "' is invalid"), null);
    callback(err, true);
  })
}


export const Claim: Model<IClaimModel> = model<IClaimModel>("Claim", ClaimSchema);
