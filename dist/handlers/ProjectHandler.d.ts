import { IProjectModel } from '../project/Project';
import { GitUtils } from '../utils/git';
export declare class ProjectHandler {
    gitUtils: GitUtils;
    repoName: string;
    constructor();
    getTemplate(args: any): void;
    create(args: any): Promise<IProjectModel>;
    list(args: any): Promise<IProjectModel[]>;
    constructTemplate(name: string): string;
    constructForm(name: string): string;
}
