import {GitUtils} from './GitUtils';

export class TemplateUtils { 

  gitUtils: GitUtils
  repoName: string

  constructor(){
    this.gitUtils = new GitUtils();
    this.repoName = 'ixofoundation';
  }

  /*
    Returns the Template and the corresponding form for the name supplied
  */
  getTemplate(templateType: string, name: string){
    var template = this.constructTemplate(templateType, name);
    var form = this.constructForm(templateType,name);

    return this.gitUtils.loadFileContents(this.repoName, template)
      .then((templateContents: any) => {
        return this.gitUtils.loadFileContents(this.repoName, form)
        .then((formContents: any) =>{
          return {
            template: JSON.parse(templateContents),
            form: JSON.parse(formContents)
          }
        });
      });
  }

  validateData(data: any, templateType: string, templateName: string){

  }

  getTemplateContents(templateType: string, templateName: string){
    
  }


  // Utilities
  constructTemplate(templateType: string, name: string){
    return "/" + templateType + "/" + name + ".json";
  }

  constructForm(templateType: string, name: string){
    return "/" + templateType + "/" + name + "_form.json";
  }
  
}

export default TemplateUtils;