"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRouter_1 = require("./AbstractRouter");
const ProjectHandler_1 = require("../handlers/ProjectHandler");
const logger = require("../logger/Logger");
var jayson = require('jayson/promise');
class ProjectRouter extends AbstractRouter_1.AbstractRouter {
    setup() {
        return {
            "create": function (args) {
                return new Promise((resolve, reject) => {
                    new ProjectHandler_1.ProjectHandler().create(args)
                        .then((data) => resolve(data))
                        .catch((err) => {
                        logger.base.error(err.message, err);
                        reject(jayson.server().error(null, err.message));
                    });
                });
            },
            "list": function (args) {
                return new Promise((resolve, reject) => {
                    new ProjectHandler_1.ProjectHandler().list(args)
                        .then((data) => resolve(data))
                        .catch((err) => {
                        logger.base.error(err.message, err);
                        reject(jayson.server().error(null, err.message));
                    });
                });
            }
        };
    }
}
exports.ProjectRouter = ProjectRouter;
// Create the Router, and export its configured Express.Router
exports.default = new ProjectRouter().router;
