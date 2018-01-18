import {TemplateUtils} from '../templates/TemplateUtils';

declare var Promise: any;

export class TemplateHandler {

  templateUtils: TemplateUtils;

  constructor(){
    this.templateUtils = new TemplateUtils();
  }

  getTemplate(args: any){
    return this.templateUtils.getTemplate(args.type + "s", args.name);
  }

}


