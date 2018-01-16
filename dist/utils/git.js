"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base64 = require("base-64");
var utf8 = require('utf8');
var fetch = require('node-fetch');
class GitUtils {
    loadFileContents(repo, path) {
        var url = this.constructUrl(repo, path);
        return fetch(url)
            .then((response) => {
            return response.json()
                .then((json) => {
                return this.decodeBase64(json.content);
            });
        });
    }
    decodeBase64(encoded) {
        var bytes = base64.decode(encoded);
        var decoded = utf8.decode(bytes);
        return decoded;
    }
    constructUrl(repo, path) {
        return "https://api.github.com/repos/" + repo + "/schema/contents" + path;
    }
}
exports.GitUtils = GitUtils;
exports.default = new GitUtils();
