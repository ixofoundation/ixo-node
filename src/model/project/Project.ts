import { Document, Schema, Model, model} from "mongoose";
import { IProject } from "./IProject";

export interface IProjectModel extends IProject, Document {
}

export var ProjectSchema: Schema = new Schema({
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
  name: {
    type: String,
    required : true
  },
  country: {
    type: String,
    required : true,
    index: true
  },
  owner: {
    did: {
      type: String,
      required : true,
      index: true
    }
  },
  about: {
    type: String,
    required: true
  },
  agentTemplate: {
    name: {
      type: String,
      required: true
    }
  },
  autoApproveInvestmentAgent: {
    type: Boolean,
    required: true,
    default: false
  },
  autoApproveServiceAgent: {
    type: Boolean,
    required: true,
    default: false
  },
  autoApproveEvaluationAgent: {
    type: Boolean,
    required: true,
    default: false
  },
  numberOfSuccessfulClaims: {
    type: Number,
    required: true,
    default: -1
  },
  claimTemplate: {
    name: {
      type: String,
      required: true
    }
  },
  evaluationTemplate: {
    name: {
      type: String,
      required: true
    }
  },
  sdg: {
    name: {
      type: String,
      required: true
    }
  }

}, {strict: false});   // Allow any other fields to also be included over and above the standard ones

ProjectSchema.pre("save", function(this: IProject, next) {
  next();
});


export const Project: Model<IProjectModel> = model<IProjectModel>("Project", ProjectSchema);
