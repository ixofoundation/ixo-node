import { IProjectModel } from '../project/Project';
export declare class ProjectHandler {
    create(args: any): Promise<IProjectModel>;
    list(args: any): Promise<IProjectModel[]>;
}
