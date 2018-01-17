"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = require("../project/Project");
const BlockChain_1 = require("../blockchain/BlockChain");
const git_1 = require("../utils/git");
class ProjectHandler {
    constructor() {
        this.gitUtils = new git_1.GitUtils();
        this.repoName = 'ixofoundation';
    }
    /*
      Returns the Template and the corresponding form for the name supplied
    */
    getTemplate(args) {
        var template = this.constructTemplate(args.name);
        var form = this.constructForm(args.name);
        return this.gitUtils.loadFileContents(this.repoName, template)
            .then((templateContents) => {
            return this.gitUtils.loadFileContents(this.repoName, form)
                .then((formContents) => {
                return {
                    template: JSON.parse(templateContents),
                    form: JSON.parse(formContents)
                };
            });
        });
    }
    create(args) {
        return BlockChain_1.default.createTransaction(JSON.stringify(args.data), args.signature.type, args.signature.signature, args.signature.creator)
            .then((transaction) => {
            // Deep clone the data using JSON
            var obj = JSON.parse(JSON.stringify(args.data));
            obj.tx = transaction.hash;
            obj.owner.did = args.signature.creator;
            return Project_1.Project.create(obj);
        });
    }
    list(args) {
        return Project_1.Project.find()
            .sort('-created')
            .exec();
    }
    // Utilities
    constructTemplate(name) {
        return "/projects/" + name + ".json";
    }
    constructForm(name) {
        return "/projects/" + name + "_form.json";
    }
}
exports.ProjectHandler = ProjectHandler;
