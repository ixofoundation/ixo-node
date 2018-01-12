import { Document, Schema, Model } from "mongoose";
import { IProject } from "./IProject";
export interface IProjectModel extends IProject, Document {
}
export declare var ProjectSchema: Schema;
export declare const Project: Model<IProjectModel>;
