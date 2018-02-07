import {TemplateUtils} from '../templates/TemplateUtils';
import {Request} from "./Request";

declare var Promise: any;

export class TemplateHandler {

  templateUtils: TemplateUtils;

  constructor(){
    this.templateUtils = new TemplateUtils();
  }

  getTemplate= (args: any) => {
    var request = new Request(args);
    return this.templateUtils.getTemplate(request.data.type + "s", request.data.name);
  }

}


