import 'mocha';
import {expect} from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {PingHandler} from '../../src/handlers/PingHandler';
import {ProjectHandler} from '../../src/handlers/ProjectHandler';
import {TemplateHandler} from '../../src/handlers/TemplateHandler';

chai.use(chaiAsPromised);

describe('Handlers', function () {
    describe('PingHandler', function () {
        it('should return pong', function () {
            var result = new PingHandler().process([]);
            expect(result).to.eql('pong');
        });
    });

    describe('ProjectHandler', function () {
      this.timeout(5000);
      it('should return "default" project template and form', function () {
          var result = new ProjectHandler().getTemplate({type: 'project', name: "default"})
              .then((res) => {
                  return res.template['@context']
              });
          expect(result).to.eventually.equal('http://ixo.foundation/schema');
      });

      it('should return and error as the type is not "project"', function () {
        expect(()=>{
          var result = new ProjectHandler().getTemplate({type: 'claim', name: "default"})
            .then((res) => {
                return res.template['@context'];
            })
        }).to.throw(Error);
      });
});

  describe('TemplateHandler', function () {
        this.timeout(5000);
        it('should return "default" project template and form', function () {
            var result = new TemplateHandler().getTemplate({type: 'project', name: "default"})
                .then((res) => {
                    return res.template['@context']
                });
            expect(result).to.eventually.equal('http://ixo.foundation/schema');
        });
    });
});