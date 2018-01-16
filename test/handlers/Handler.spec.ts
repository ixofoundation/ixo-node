import * as chai from 'chai';
import 'mocha';
import {expect} from 'chai';
import {PingHandler} from '../../src/handlers/PingHandler';
import {ProjectHandler} from '../../src/handlers/ProjectHandler';
import * as chaiAsPromised from 'chai-as-promised';

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
            var result = new ProjectHandler().getTemplate({name: "default"})
                .then((res) => {
                    return res.template['@context']
                });
            return expect(result).to.eventually.equal('http://ixo.foundation/schema');
        });
    });
});