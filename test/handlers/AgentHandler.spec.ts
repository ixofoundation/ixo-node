import 'mocha';
import {expect} from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import * as mongoose from 'mongoose';
require('mongoose').Promise = global.Promise;

import {Project, IProjectModel} from '../../src/model/project/Project';
import {AgentHandler} from '../../src/handlers/AgentHandler';
import {Request} from '../../src/handlers/Request';
import {IxoValidationError} from '../../src/errors/IxoValidationError';
import {CryptoUtils} from '../../src/utils/CryptoUtils';

var cryptoUtils = new CryptoUtils();
var wallet = cryptoUtils.generateWalletAndKeys();
var wallet2 = cryptoUtils.generateWalletAndKeys();

chai.use(chaiAsPromised);

describe('AgentHandler', function () {
    var obj = {
        owner:{
            email:"joe@bloggs.com",
            name:"Joe Blogs",
            did: wallet.address
        },
        name:"Water Saving",
        country:"ZA",
        tx: "88aa881cf8b89ccba4ab22b574169097374b6eaf0d6f6f1dcf7447128a96caa5"
    };

    describe('getTemplate()', function () {
        this.timeout(5000);
        it('should return "default" agent template and form', function () {
            var promise = new AgentHandler().getTemplate({payload: {data:{name: "default"},did:wallet.address}})
                .then((res) => {
                    return res.template['@context']
                });
            return expect(Promise.resolve(promise)).to.eventually.equal('http://ixo.foundation/schema');
        });

        it('should return and error as the type is not "agent"', function () {
            return new AgentHandler().getTemplate({payload: {data:{type: 'claim', name: "default"},did:wallet.address}})
                .catch((err: Error) => {
                    return expect(err.message).to.equal("Template 'type' must be 'agent'");
                });
        });
    });

    describe('create()', function () {
        this.timeout(15000);
        it('should create an agent', function () {
            return Project.create(obj)
            .then((res) => {
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":obj.tx},"did":wallet.address};
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
                return expect(res['email']).to.equal('joe@bloggs.com');
            });
        });
        it('should fail to create an agent - project is not valid', function () {
            var badProjecTx = "0000001cf8b89ccba4ab22b574169097374b6eaf0d6f6f1dcf7447128a96caa5";
            return Project.create(obj)
            .then((res) => {
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":badProjecTx},"did":wallet.address};
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
                .catch((err) => {
                    return expect(err.message).to.equal("ProjectTx: '" + badProjecTx + "' is invalid");
                });
            })
        });
        it('should fail to create an agent already registered on project', function () {
            return Project.create(obj)
            .then((res) => {
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":obj.tx},"did":wallet.address};
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
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":obj.tx},"did":wallet.address};
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
                .catch((err) => {
                    return expect(err.message).to.equal("Agent: '" + wallet.address + "' already exists on the project");
                });
            })
        })
        it('should fail to create a SA agent if they are and EA', function () {
            return Project.create(obj)
            .then((res) => {
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"EA","projectTx":obj.tx},"did":wallet.address};
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
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":obj.tx},"did":wallet.address};
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
                .catch((err) => {
                    return expect(err.message).to.equal("An agent cannot be a Service Agent and an Evaluation agent on the same project");
                });
            })
        })
        it('should fail to create a EA agent if they are and SA', function () {
            return Project.create(obj)
            .then((res) => {
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"SA","projectTx":obj.tx},"did":wallet.address};
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
                var payload = {"data":{"email":"joe@bloggs.com","name":"Joe Blogs","role":"EA","projectTx":obj.tx},"did":wallet.address};
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
                .catch((err) => {
                    return expect(err.message).to.equal("An agent cannot be a Service Agent and an Evaluation agent on the same project");
                });
            })
        })
    });

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

        it('should not authorise an agent that does not exist', function () {
            var badTx = "000000000000000000000000000";
            var payload = {"data":{"agentTx":badTx,"status":"Approved"},"did":wallet.address};
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
            .catch((err) => {
                return expect(err.message).to.equal("Agent: '" + badTx + "' does not exist");
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

    describe('listForDID()', function () {
        this.timeout(15000);
        
        it('should listForDID agents for valid did', function () {
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
                return new AgentHandler().listForDID({
                    "payload":{"data": {"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"}})
                .then((res) => {
                    return expect(res.length).to.equal(1);
                });
            })

        });
    });

    
    describe('listForProject()', function () {
        this.timeout(15000);
        
        it('should listForProject for valid projectTx', function () {
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
                return new AgentHandler().listForProject({
                    "payload":{"data": {"projectTx":"88aa881cf8b89ccba4ab22b574169097374b6eaf0d6f6f1dcf7447128a96caa5"},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"}})
                .then((res) => {
                    return expect(res.length).to.equal(1);
                })
            });
        });
    });

});

