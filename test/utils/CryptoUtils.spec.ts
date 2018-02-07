import 'mocha';
import {expect} from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {CryptoUtils} from '../../src/utils/CryptoUtils';

chai.use(chaiAsPromised);

describe('CryptoUtil', function () {
    var data = "Hello World!!";
    var Ed25519PublicKey = "0x86qu8rDWi4xb7gtHbqjg4cd78DJLVBoBr61N9aBDur65";
    var Ed25519Signature =  "0xAM1igNwTer7kc13CoSL37BLjmUEjQbAnhuE6rhWvCLxycVsyjqtn7WynRV5TnHQgPb5bvYndA64rkssAyZ4K4siKZ7KiHzrJ7fRSbweyE";
    var Ed25519SignatureInvalid =  "0xer1igNwTer7kc13CoSL37BLjmUEjQbAnhuE6rhWvCLxycVsyjqtn7WynRV5TnHQgPb5bvYndA64rkssAyZ4K4siKZ7KiHzrJ7fRSbweyE";

    var ECDSAPublicKey = "0x92928b5135d8dbad88b1e772bf5b8f91bfe41a8d";
    var ECDSASignature =  "0x7ab6f2b063973c1a4b7b297f4ec948b4a18be5b423d9af93fd4fa3743bef496b381ab5368935d1fb9e734efe7ff62cd066a9450083f50fef041799926b1a4cb01c";
    var ECDSASignatureInvalid =  "0x8ab6f2b063973c1a4b7b297f4ec948b4a18be5b423d9af93fd4fa3743bef496b381ab5368935d1fb9e734efe7ff62cd066a9450083f50fef041799926b1a4cb01c";

    describe('Test remove0x', function () {
        it('should remove 0x from input', function () {
            return expect(new CryptoUtils().remove0x("0x12345")).to.eq("12345");
        });

        it('should should leave input unchanged', function () {
            return expect(new CryptoUtils().remove0x("12345")).to.eq("12345");
        });
    });

    describe('Ed25519: Verify Signature valid', function () {
        it('should return valid', function () {
            expect(new CryptoUtils().validateSignature(data, "Ed25519", Ed25519Signature, Ed25519PublicKey)).to.eq(true);
        });

        it('should return invalid', function () {
            expect(new CryptoUtils().validateSignature(data, "Ed25519", Ed25519SignatureInvalid, Ed25519PublicKey)).to.eq(false);
        });
    });

    describe('ECDSA: Verify Signature valid', function () {
        it('should return valid', function () {
            expect(new CryptoUtils().validateSignature(data, "ECDSA", ECDSASignature, ECDSAPublicKey)).to.eq(true);
        });

        it('should return invalid', function () {
            expect(new CryptoUtils().validateSignature(data, "ECDSA", ECDSASignatureInvalid, ECDSAPublicKey)).to.eq(false);
        });
    });

});