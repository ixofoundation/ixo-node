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
  owner: {
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
  },
  name: {
    type: String,
    required : true
  },
  country: {
    type: String,
    required : true,
    index: true
  }
}, {strict: false});   // Allow any other fields to also be included over and above the standard ones

 ProjectSchema.pre("save", function(this: IProject, next) {
  next();
});


export const Project: Model<IProjectModel> = model<IProjectModel>("Project", ProjectSchema);
