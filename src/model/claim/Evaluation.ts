import { Document, Schema, Model, model} from "mongoose";

import { IEvaluation } from "./IEvaluation";

import {IxoValidationError} from "../../errors/IxoValidationError";

export interface IEvaluationModel extends IEvaluation, Document {
}

export var EvaluationSchema: Schema = new Schema({
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
  },
  result: {
    type: String,
    required : true,
    default: 'Pending'
  }
}, {strict: false});   // Allow any other fields to also be included over and above the standard ones

EvaluationSchema.pre("save", function(this: IEvaluation, next) {
  // validateAgent(this.did, this.projectTx, (err: Error, ret: boolean) =>{
  //   if(err){
  //     next(err);
  //     return;
  //   }
    next();
  // })
});

// Check that a valid Project TX is supplied
// function validateAgent(did: String, projectTx: String, callback: Function){
//   Agent.findOne({"did": did, role: 'SA', projectTx: projectTx}, (err, agent) => {
//     if(agent == null)
//       callback(new IxoValidationError("ProjectTx: '" + projectTx + "' The agent did: '" + did + "' is invalid"), null);
//     callback(err, true);
//   })
// }


export const Evaluation: Model<IEvaluationModel> = model<IEvaluationModel>("Evaluation", EvaluationSchema);
