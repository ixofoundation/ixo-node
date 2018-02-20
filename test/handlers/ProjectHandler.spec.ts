import 'mocha';
import {expect} from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import * as mongoose from 'mongoose';
require('mongoose').Promise = global.Promise;

import {ProjectHandler} from '../../src/handlers/ProjectHandler';

import {Request} from '../../src/handlers/Request';
import {IxoValidationError} from '../../src/errors/IxoValidationError';
import {CryptoUtils} from '../../src/utils/CryptoUtils';
import { Agent } from '../../src/model/agent/Agent';

var cryptoUtils = new CryptoUtils();
var wallet = cryptoUtils.generateWalletAndKeys();
var wallet2 = cryptoUtils.generateWalletAndKeys();

chai.use(chaiAsPromised);

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
 
before(function(done) {
    mongoose.connect('mongodb://localhost/TestingDB', { useMongoClient: true });
    mongoose.connection.on('connected', () => { 
        console.log("Database connected"); 
        done();
    });
});

afterEach(function (done) {
    mongoose.connection.db.dropDatabase(done);
});

  
describe('ProjectHandler', function () {
    var payload = {"data":
        {"owner":{
            "email":"joe@bloggs.com",
            "name":"Joe Blogs"
        },
        "name":"Water Saving",
        "country":"ZA", 
        "about":"A project", 
        "agentTemplate": {
            "name": "default"
        },
        "claimTemplate": {
            "name": "default"
        },
        "evaluationTemplate": {
            "name": "default"
        },
        "numberOfSuccessfulClaims": 10,
        "autoApproveInvestmentAgent": true,
        "autoApproveServiceAgent": true,
        "autoApproveEvaluationAgent": true,
    },"did":wallet.address};


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
                .catch((err: Error) => {
                    return expect(err.message).to.equal("Template 'type' must be 'project'");
                });
        });
    });

    describe('create()', function () {
        this.timeout(15000);
        it('should create a project', function () {
            var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
            return new ProjectHandler().create({
                "payload": payload,
                "signature":{
                    "type":"ECDSA",
                    "creator":wallet.address,
                    "created":"2016-02-08T16:02:20Z",
                    "signature":signature
                }})
                .then((res) => {
                    return expect(res['name']).to.equal('Water Saving');
                });
        });
    });

    describe('list()', function () {
        this.timeout(15000);
        
        it('should list projects', function () {
            // Add a project
            var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
            return new ProjectHandler().create({
                "payload":payload,
                "signature":{
                    "type":"ECDSA",
                    "creator":wallet.address,
                    "created":"2016-02-08T16:02:20Z",
                    "signature":signature
                }})
                .then((res) => {
                    return new ProjectHandler().list({
                        "payload":{"data": {},"did":wallet.address}})
                        .then((res) => {
                            return expect(res.length).to.equal(1);
                        })
                });
        });
    });

    describe('listForDID()', function () {
        this.timeout(15000);
        
        it('should listForDID projects for valid did', function () {
            // Add a project
            var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
            return new ProjectHandler().create({
                "payload":payload,
                "signature":{
                    "type":"ECDSA",
                    "creator":wallet.address,
                    "created":"2016-02-08T16:02:20Z",
                    "signature":signature
                }})
                .then((res) => {
                    return new ProjectHandler().listForDID({
                        "payload":{"data": {"did":wallet.address},"did":wallet.address}})
                        .then((res) => {
                            return expect(res.length).to.equal(1);
                        });
                })

        });
    });
    describe('listForDID()', function () {
        this.timeout(15000);
        
        it('should listForDID projects for invalid did', function () {
            var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
            return new ProjectHandler().create({
                "payload":payload,
                "signature":{
                    "type":"ECDSA",
                    "creator":wallet.address,
                    "created":"2016-02-08T16:02:20Z",
                    "signature":signature
                }})
                .then((res) => {
                    return new ProjectHandler().listForDID({
                        "payload":{"data": {"did":wallet2.address},"did":wallet.address}})
                        .then((res) => {
                            return expect(res.length).to.equal(0);
                        })
                });
        });
    });

    describe('listForAgentDIDAndRole()', function () {
        this.timeout(15000);
        
        it('should listForAgentDIDAndRole projects for valid did and role', function () {
            var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
            return new ProjectHandler().create({
                "payload":payload,
                "signature":{
                    "type":"ECDSA",
                    "creator":wallet.address,
                    "created":"2016-02-08T16:02:20Z",
                    "signature":signature
                }}).then((proj)=> {
                    var agent = {"did":wallet2.address,"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":proj.tx};
                    return Agent.create(agent);  
                })
                .then((res) => {
                    return new ProjectHandler().listForAgentDIDAndRole({
                        "payload":{"data": {"did":wallet2.address, "role":'SA'},"did":wallet.address}})
                        .then((res) => {
                            return expect(res.length).to.equal(1);
                        })
                });
        });
    });
});

