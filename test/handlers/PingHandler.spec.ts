import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;
var expects = require('assert');

import {PingHandler} from '../../src/handlers/PingHandler';

describe('Handlers', function() {
  describe('PingHandler', function() {
    it('should return pong', function() {
      let handlerFunc = new PingHandler().process();
      handlerFunc([]).then(function(responses){
        expects(responses[0].result).to.eql('pong');
      }).catch(function(responses){
        
      })
    });
  });
});