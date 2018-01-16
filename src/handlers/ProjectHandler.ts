import {Project, IProjectModel} from '../project/Project';
import blockchain from '../blockchain/BlockChain';
import { ITransactionModel } from '../blockchain/models/Transaction';
import {GitUtils} from '../utils/git';

declare var Promise: any;

export class ProjectHandler {

  gitUtils: GitUtils
  repoName: string

  constructor(){
    this.gitUtils = new GitUtils();
    this.repoName = 'ixofoundation';
  }

  /*
    Returns the Template and the corresponding form for the name supplied
  */
  getTemplate(args: any){
    var template = this.constructTemplate(args.name);
    var form = this.constructForm(args.name);

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

  create(args: any) {
    return blockchain.createTransaction(JSON.stringify(args.data), args.signature.sign, args.signature.publicKey)
      .then((transaction: ITransactionModel) => {
        return Project.create({
          "tx": transaction.hash,
          "name": args.data.name,
          "owner": args.data.owner
        })
      })
  }

  list(args: any) {
    return Project.find()
      .sort('-created')
      .exec();
    }



  // Utilities
  constructTemplate(name: string){
    return "/projects/" + name + ".json";
  }

  constructForm(name: string){
    return "/projects/" + name + "_form.json";
  }

}

