import 'mocha';
import {expect} from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {PingHandler} from '../../src/handlers/PingHandler';
import {ProjectHandler} from '../../src/handlers/ProjectHandler';
import {TemplateHandler} from '../../src/handlers/TemplateHandler';
import {Request} from '../../src/handlers/Request';
import {IxoValidationError} from '../../src/errors/IxoValidationError';

chai.use(chaiAsPromised);

describe('Handlers', function () {
    describe('PingHandler', function () {
        it('should return pong', function () {
            var result = new PingHandler().process([])
                .then((res) => {
                    return res;
                });
                return expect(result).to.eventually.equal('pong');
        });
    });

    describe('TemplateHandler', function () {
        this.timeout(5000);
        it('should return "default" project template and form', function () {
            var promise = new TemplateHandler().getTemplate({payload: {data:{type: 'project', name: "default"},did:"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"}})
                .then((res) => {
                    console.log(JSON.stringify(res));
                    return res.template['@context']
                });
            return expect(Promise.resolve(promise)).to.eventually.equal('http://ixo.foundation/schema');
        });
    });

    describe('Request', function () {
        var requestData = {
            payload: {"data":{"owner":{"email":"joe@bloggs.com","name":"Joe Blogs"},"name":"Water Saving","country":"ZA"},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"},
            signature:{
                type:"ECDSA",
                creator:"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d",
                created:"2016-02-08T16:02:20Z",
                signature:"0xd007781b71c7a17d8dc0575ebd186646f256a565b0964997157c01625e4346fa3b4b1686ba004f18ee46106f5415d450c26af3da6ec9cf88e2b25e6fcf3785f81b"
            }
        };

        it('should validate', function () {
            var request = new Request(JSON.parse(JSON.stringify(requestData)));
            var result = request.verifySignature();
            return expect(result).to.be.true;
        });
        it('should fail because of invalid did in payload', function () {
            var newRequestData = {...requestData};
            newRequestData.payload = {"data":{"owner":{"email":"joe@bloggs.com","name":"Joe Blogs"},"name":"Water Saving","country":"ZA"},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8e"};
            newRequestData.signature.signature = "0xa3ac318dfb30d74d1a469424e2bc8ad6aa7bf9ef732cadd6ec97415b52c763046efc6c4b4dfc3be20011a05c5ba9ab0b97b3c9cd519bb302635b881588afa6e81b";
            var request = new Request(JSON.parse(JSON.stringify(newRequestData)));
            return expect(() => {request.verifySignature()}).to.throw(IxoValidationError);;
        });

    });
});