const jayson = require('jayson/promise');

const express = require('express')
, router = express.Router()

const network = require('./network');
router.post('/network', jayson.server(network).middleware());

router.get('/', function(req, res) {
  res.send('API is running')
})

module.exports = router;

