import 'mocha';
import {expect} from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import * as mongoose from 'mongoose';
require('mongoose').Promise = global.Promise;

import {Project, IProjectModel} from '../../src/model/project/Project';
import {Agent, IAgentModel} from '../../src/model/agent/Agent';
import {Evaluation, IEvaluationModel, EVALUATION_STATUS} from '../../src/model/claim/Evaluation';
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

        it('should fail if agent is not a SA create a claim', function () {
            return Project.create(projectData)
            .then( (project) => {
                return Agent.create({...agentData, role: 'EA'})
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
                    .catch((err) => {
                        return expect(err.message).to.equal("ProjectTx: '" + projectData.tx + "' The agent did: '" + wallet.address + "' is invalid");
                    });
                })
            })
        })

    });

    describe('evaluateClaim()', function () {
        this.timeout(15000);
        it('should evaluate the claim', function () {
            return Project.create(projectData)
            .then( (project) => {
                // Create EA
                return Agent.create({...agentData, role: 'EA', did: wallet2.address})
                .then((agent) => {
                    // Create SA
                    return Agent.create(agentData)
                    .then((agent) => {
                        //Create Claim
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
                    })
                })
            })
            .then((res) => {
                var payload = {"data":{"claimTx":res.tx,"result":EVALUATION_STATUS.Approved},"did":wallet2.address};
                var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet2.privateKey);
                return new ClaimHandler().evaluateClaim({
                    "payload":payload,
                    "signature":{
                        "type":"ECDSA",
                        "creator":wallet2.address,
                        "created":"2016-02-08T16:02:20Z",
                        "signature":signature
                    }
                })
            })
            .then((res) => {
                expect(res['evaluations'].length).to.equal(1);
                return expect(res['latestEvaluation']).to.equal(EVALUATION_STATUS.Approved);
            });
        });

        it('should fail evaluation as agent is not a EA', function () {
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
                })
            })
            .then((res) => {
                var payload = {"data":{"claimTx":res.tx,"result":EVALUATION_STATUS.Approved},"did":wallet.address};
                var signature = cryptoUtils.signECDSA(JSON.stringify(payload), wallet.privateKey);
                return new ClaimHandler().evaluateClaim({
                    "payload":payload,
                    "signature":{
                        "type":"ECDSA",
                        "creator":wallet.address,
                        "created":"2016-02-08T16:02:20Z",
                        "signature":signature
                    }
                })
            })
            .catch((err) => {
                return expect(err.message).to.equal("Only the Evaluation agents on project can evaluate claims");
            });
        });
    })

    describe('list', function () {
        this.timeout(15000);
        
        it('should list claims', function () {
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
                        return new ClaimHandler().listForProject ({
                            "payload":{"data": {"projectTx":projectData.tx},"did":wallet.address}})
                        .then((res) => {
                            return expect(res.length).to.equal(1);
                        });
                    })
                })
            })
        });
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
    describe('listForProjectAndStatus()', function () {
        this.timeout(15000);
        
        it('should listForProjectStatus', function () {
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
                        return new ClaimHandler().listForProjectAndStatus({
                            "payload":{"data": {"projectTx":projectData.tx, status: EVALUATION_STATUS.Pending},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"}})
                        .then((res) => {
                            return expect(res.length).to.equal(1);
                        })
                    })
                })
            });
        });
    });
    describe('listForProjectAndDID()', function () {
        this.timeout(15000);
        
        it('should listForProjectDID', function () {
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
                        return new ClaimHandler().listForProjectAndDID({
                            "payload":{"data": {"projectTx":projectData.tx, did: wallet.address},"did":"0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d"}})
                        .then((res) => {
                            return expect(res.length).to.equal(1);
                        })
                    })
                })
            });
        });
    })
});

