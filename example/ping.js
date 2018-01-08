const jayson = require('jayson');

var client = jayson.client.https('https://arcane-stream-64697.herokuapp.com/api/network');
//var client = jayson.client.http('http://localhost:5000/api/network');
client.request('ping', [], null, function(err) {
  if(err) throw err;
  console.log('ok'); // request was received successfully
});