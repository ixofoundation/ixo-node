const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');

const controllers = require('./src/controllers');

const PORT = process.env.PORT || 5000

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', controllers);
app.listen(PORT);

console.log(`Listening on ${ PORT }`);