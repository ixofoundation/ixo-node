import { IProjectModel } from '../project/Project';
import { TemplateUtils } from '../templates/TemplateUtils';
export declare class ProjectHandler {
    templateUtils: TemplateUtils;
    constructor();
    getTemplate(args: any): Promise<{
        template: any;
        form: any;
    }>;
    create(args: any): Promise<IProjectModel[]>;
    list(args: any): Promise<IProjectModel[]>;
}
