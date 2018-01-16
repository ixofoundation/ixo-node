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
        var fileContents = this.gitUtils.loadFileContents(this.repoName, template)
            .then((res) => {
            return res;
        });
    }
    create(args) {
        return BlockChain_1.default.createTransaction(JSON.stringify(args.data), args.signature.sign, args.signature.publicKey)
            .then((transaction) => {
            return Project_1.Project.create({
                "tx": transaction.hash,
                "name": args.data.name,
                "owner": args.data.owner
            });
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
