const jayson_promise = require('jayson/promise');

var network = {
  "ping": function(args) {
    return new Promise(function(resolve, reject) {
      resolve('pong');
    });
  }
}

module.exports = network;