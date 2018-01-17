"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const http = require("http");
const mongoose = require("mongoose");
const App_1 = require("./App");
// Set the port
const port = normalizePort(process.env.PORT || '');
App_1.default.set('port', port);
const server = http.createServer(App_1.default);
// Connect to Mongo DB
//Set mongoose Pormise
require('mongoose').Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || '', { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error: Cannot start'));
db.once('open', function () {
    console.log('MongDB connected!');
    // Once connected listen on server
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
});
process.on('SIGTERM', function () {
    db.close();
    server.close(function () {
        process.exit(0);
    });
});
function normalizePort(val) {
    let port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
}
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.log(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.log(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}
