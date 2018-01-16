import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import {PingHandler} from '../../src/handlers/PingHandler';
import {ProjectHandler} from '../../src/handlers/ProjectHandler';

describe('Handlers', function() {
  describe('PingHandler', function() {
    it('should return pong', function() {
      var result = new PingHandler().process([]);
      expect(result).to.eql('pong');
    });
  });

  describe('ProjectHandler', function() {
    it('should return "default" project template and form', function() {
      var result = new ProjectHandler().getTemplate({name:"default"})
        .then((res) => {
          return res.template['@context']
        });

      return expect(result).to.eventually.equal('http://ixo.foundation/schema');
    });
  });
});