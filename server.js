const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const jayson = require('jayson');
const PORT = process.env.PORT || 5000

var network = {
    "ping": function(args, callback) {
        console.log(callback);
        callback(null, 'pong');
    }
}

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post('/network', jayson.server(network).middleware());
app.listen(PORT);

console.log(`Listening on ${ PORT }`);