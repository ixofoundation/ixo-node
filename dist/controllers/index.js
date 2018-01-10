"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jayson = require('jayson/promise');
const express = require("express");
const network = require("./network");
let router = express.Router();
// placeholder route handler
router.get('/', (req, res, next) => {
    res.send('API is running');
});
router.post('api/network', jayson.server(network).middleware());
module.exports = router;
