const jayson = require('jayson/promise');

//var client = jayson.client.https('https://arcane-stream-64697.herokuapp.com/api/network');
var client = jayson.client.http('http://localhost:5000/api/network');

var reqs = [
  client.request('ping', []),
];

Promise.all(reqs).then(function(responses) {
  if(responses[0].error) console.log('error');
  console.log(responses[0].result);
});
