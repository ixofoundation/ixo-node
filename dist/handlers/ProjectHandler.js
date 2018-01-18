"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = require("../project/Project");
const BlockChain_1 = require("../blockchain/BlockChain");
const TemplateUtils_1 = require("../templates/TemplateUtils");
class ProjectHandler {
    constructor() {
        this.templateUtils = new TemplateUtils_1.TemplateUtils();
    }
    getTemplate(args) {
        if (args.type == "project") {
            return this.templateUtils.getTemplate("projects", args.name);
        }
        else {
            throw Error("Template 'type' must be 'project'");
        }
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
}
exports.ProjectHandler = ProjectHandler;
