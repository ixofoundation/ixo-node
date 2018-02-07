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

var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
 
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
 
before(function(done) {
    mockgoose.prepareStorage().then(function() {
        console.log("preparing database");
        mongoose.connect('mongodb://example.com/TestingDB', { useMongoClient: true }, function(err) {
            done(err);
        });
    });
});

describe('ProjectHandler', function () {
    describe('getTemplate()', function () {
        this.timeout(5000);
        it('should return "default" project template and form', function () {
            var promise = new ProjectHandler().getTemplate({payload: {data:{name: "default"},did:"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"}})
                .then((res) => {
                    return res.template['@context']
                });
            return expect(Promise.resolve(promise)).to.eventually.equal('http://ixo.foundation/schema');
        });

        it('should return and error as the type is not "project"', function () {
            return new ProjectHandler().getTemplate({payload: {data:{type: 'claim', name: "default"},did:"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"}})
                .then((res) => {
                    console.log(JSON.stringify(res));
                    return res.template['@context'];
                })
                .catch((err) => {
                    console.log("Error raised");
                    return expect(err).to.equal(Error);
                });
            //return expect(Promise.reject(promise)).to.be.rejectedWith("Error: Template 'type' must be 'project'");
        });
    });

    describe('create()', function () {
        this.timeout(15000);
        it('should create a project', function () {
            var promise = new ProjectHandler().create({
                "payload":{"data": {"owner":{"email":"joe@bloggs.com","name":"Joe Blogs"},"name":"Water Saving","country":"ZA"},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"},
                "signature":{
                    "type":"ECDSA",
                    "creator":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d",
                    "created":"2016-02-08T16:02:20Z",
                    "signature":"0xd007781b71c7a17d8dc0575ebd186646f256a565b0964997157c01625e4346fa3b4b1686ba004f18ee46106f5415d450c26af3da6ec9cf88e2b25e6fcf3785f81b"
                }})
                .then((res) => {
                    return res['name']
                })
            return expect(Promise.resolve(promise)).to.eventually.equal('Water Saving');
        });
    });

});

