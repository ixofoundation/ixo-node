import 'mocha';
import {expect} from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import * as mongoose from 'mongoose';
require('mongoose').Promise = global.Promise;

import {Project, IProjectModel} from '../../src/model/project/Project';
import {Agent, IAgentModel} from '../../src/model/agent/Agent';
import {ClaimHandler} from '../../src/handlers/ClaimHandler';
import {Request} from '../../src/handlers/Request';
import {IxoValidationError} from '../../src/errors/IxoValidationError';
import {CryptoUtils} from '../../src/utils/CryptoUtils';

var cryptoUtils = new CryptoUtils();
var wallet = cryptoUtils.generateWalletAndKeys();
var wallet2 = cryptoUtils.generateWalletAndKeys();

chai.use(chaiAsPromised);

describe('ClaimHandler', function () {
    var projectData = {
        owner:{
            email:"joe@bloggs.com",
            name:"Joe Blogs",
            did: wallet.address
        },
        name:"Water Saving",
        country:"ZA",
        tx: "88aa881cf8b89ccba4ab22b574169097374b6eaf0d6f6f1dcf7447128a96caa5"
    };

    var agentData = {
        projectTx: "88aa881cf8b89ccba4ab22b574169097374b6eaf0d6f6f1dcf7447128a96caa5",
        tx: "00aa881cf8b89ccba4ab22b574169097374b6eaf0d6f6f1dcf7447128a96caa5",
        email:"joe@bloggs.com",
        name:"Joe Blogs",
        did: wallet.address,
        role: 'SA',
        latestStatus: 'Approved'
    };

    describe('getTemplate()', function () {
        this.timeout(5000);
        it('should return "default" claim template and form', function () {
            var promise = new ClaimHandler().getTemplate({payload: {data:{name: "default"},did:wallet.address}})
                .then((res) => {
                    return res.template['@context']
                });
            return expect(Promise.resolve(promise)).to.eventually.equal('http://ixo.foundation/schema');
        });

        it('should return and error as the type is not "claim"', function () {
            return new ClaimHandler().getTemplate({payload: {data:{type: 'agent', name: "default"},did:wallet.address}})
                .catch((err: Error) => {
                    return expect(err.message).to.equal("Template 'type' must be 'claim'");
                });
        });
    });

    describe('create()', function () {
        this.timeout(15000);
        it('should create a claim', function () {
            return Project.create(projectData)
            .then( (project) => {
                return Agent.create(agentData)
                .then((agent) => {
                    var payload = {"data":{"name":"Sipho","attended":true,"projectTx":projectData.tx},"did":wallet.address};
                    var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
                    return new ClaimHandler().create({
                        "payload":payload,
                        "signature":{
                            "type":"ECDSA",
                            "creator":wallet.address,
                            "created":"2016-02-08T16:02:20Z",
                            "signature":signature
                        }
                    })
                    .then((res) => {
                        return expect(res['did']).to.equal(wallet.address);
                    });
                })
            })
        })

        it('should fail if not a valid agent create a claim', function () {
            return Project.create(projectData)
            .then( (project) => {
                return Agent.create(agentData)
                .then((agent) => {
                    var payload = {"data":{"name":"Sipho","attended":true,"projectTx":projectData.tx},"did":wallet2.address};
                    var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet2.privateKey);
                    return new ClaimHandler().create({
                        "payload":payload,
                        "signature":{
                            "type":"ECDSA",
                            "creator":wallet2.address,
                            "created":"2016-02-08T16:02:20Z",
                            "signature":signature
                        }
                    })
                    .catch((err) => {
                        return expect(err.message).to.equal("ProjectTx: '" + projectData.tx + "' The agent did: '" + wallet2.address + "' is invalid");
                    });
                        })
            })
        })
    });


    describe('listForDID()', function () {
        this.timeout(15000);
        
        it('should listForDID claims for valid did', function () {
            return Project.create(projectData)
            .then( (project) => {
                return Agent.create(agentData)
                .then((agent) => {
                    var payload = {"data":{"name":"Sipho","attended":true,"projectTx":projectData.tx},"did":wallet.address};
                    var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
                    return new ClaimHandler().create({
                        "payload":payload,
                        "signature":{
                            "type":"ECDSA",
                            "creator":wallet.address,
                            "created":"2016-02-08T16:02:20Z",
                            "signature":signature
                        }
                    })
                    .then((res) => {
                        return new ClaimHandler().listForDID({
                            "payload":{"data": {"did":wallet.address},"did":wallet.address}})
                        .then((res) => {
                            return expect(res.length).to.equal(1);
                        });
                    })
                })
            })
        });
    });

    
    describe('listForProject()', function () {
        this.timeout(15000);
        
        it('should listForProject for valid projectTx', function () {
            return Project.create(projectData)
            .then( (project) => {
                return Agent.create(agentData)
                .then((agent) => {
                    var payload = {"data":{"name":"Sipho","attended":true,"projectTx":projectData.tx},"did":wallet.address};
                    var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
                    return new ClaimHandler().create({
                        "payload":payload,
                        "signature":{
                            "type":"ECDSA",
                            "creator":wallet.address,
                            "created":"2016-02-08T16:02:20Z",
                            "signature":signature
                        }
                    })
                    .then((res) => {
                        return new ClaimHandler().listForProject({
                            "payload":{"data": {"projectTx":projectData.tx},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"}})
                        .then((res) => {
                            return expect(res.length).to.equal(1);
                        })
                    })
                })
            });
        });
    });

});

/*
   describe('authoriseAgent()', function () {
        this.timeout(15000);
        it('should authorise an agent', function () {
            return Project.create(obj)
            .then((res) => {
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":"88aa881cf8b89ccba4ab22b574169097374b6eaf0d6f6f1dcf7447128a96caa5"},"did":wallet.address};
                var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
                return new AgentHandler().create({
                    "payload":payload,
                    "signature":{
                        "type":"ECDSA",
                        "creator":wallet.address,
                        "created":"2016-02-08T16:02:20Z",
                        "signature":signature
                    }
                })
            })
            .then((res) => {
                var payload = {"data":{"agentTx":res.tx,"status":"Approved"},"did":wallet.address};
                var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
                return new AgentHandler().updateAgentStatus({
                    "payload":payload,
                    "signature":{
                        "type":"ECDSA",
                        "creator":wallet.address,
                        "created":"2016-02-08T16:02:20Z",
                        "signature":signature
                    }
                })
            })
            .then((res) => {
                expect(res['statuses'].length).to.equal(1);
                return expect(res['latestStatus']).to.equal('Approved');
            });
        });

        it('should not authorise an agent - invalid project owner', function () {
            return Project.create(obj)
            .then((res) => {
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":"88aa881cf8b89ccba4ab22b574169097374b6eaf0d6f6f1dcf7447128a96caa5"},"did":wallet.address};
                var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
                return new AgentHandler().create({
                    "payload":payload,
                    "signature":{
                        "type":"ECDSA",
                        "creator":wallet.address,
                        "created":"2016-02-08T16:02:20Z",
                        "signature":signature
                    }
                })
            })
            .then((res) => {
                var payload = {"data":{"agentTx":res.tx,"status":"Approved"},"did":wallet2.address};
                var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet2.privateKey);
                return new AgentHandler().updateAgentStatus({
                    "payload":payload,
                    "signature":{
                        "type":"ECDSA",
                        "creator":wallet2.address,
                        "created":"2016-02-08T16:02:20Z",
                        "signature":signature
                    }
                })
            })
            .catch((err) => {
                return expect(err.message).to.equal('Only the project owner can update an agents status');
            });
        });
    });

    describe('list()', function () {
        this.timeout(15000);
        
        it('should list agents', function () {
            return Project.create(obj)
            .then((res) => {
                return new AgentHandler().create({
                    "payload":{"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":"88aa881cf8b89ccba4ab22b574169097374b6eaf0d6f6f1dcf7447128a96caa5"},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"},
                    "signature":{
                        "type":"ECDSA",
                        "creator":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d",
                        "created":"2016-02-08T16:02:20Z",
                        "signature":"0xedf2ac62d9e2c59d4e8e9be77bceaa0b506cd1dca90498b9c1dd6313a1803c28532cf3ee3a86c8afba197633fd3fd8fca6b35c27a52c6d413898c6ed86c7cc281c"
                    }
                })
            })
           .then((res) => {
                return new AgentHandler().list({
                    "payload":{"data": {},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"}})
                    .then((res) => {
                        return expect(res.length).to.equal(1);
                    })
            });
        });
    });

*/
