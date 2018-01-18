import * as crypto from 'crypto';
import * as logger from '../logger/Logger';

var ethUtil = require('ethereumjs-util');

export class CryptoUtils { 
  
  createNonce(size = 64){
    return crypto.randomBytes(Math.floor(size / 2)).toString('hex');
  }

  validateSignature(data: String, type: String, signature: String, address: String): Boolean{
    if(type != 'ECDSA'){
      throw Error("Signature: '" + type + "' not supported");
    }
    // Same data as before
    var message = ethUtil.toBuffer(data);
    var msgHash = ethUtil.hashPersonalMessage(message);

    var signatureBuffer = ethUtil.toBuffer(signature);
    var sigParams = ethUtil.fromRpcSig(signatureBuffer);

    var recoveredPublicKey = ethUtil.ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s);
    
    var sender = ethUtil.publicToAddress(recoveredPublicKey);
    var recoveredAddress = ethUtil.bufferToHex(sender);
    if((recoveredAddress != address)){
      logger.base.debug("Signature failed - in: " + address + " out: " + recoveredAddress);
    }
    return (recoveredAddress == address);

  }

  hash(input: any): String {
    let anyString = typeof (input) == 'object' ? JSON.stringify(input) : input.toString();
    let hash = crypto.createHash('sha256').update(anyString).digest('hex');
    return hash;
  }

}

export default CryptoUtils;