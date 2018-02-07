import { IRequest } from "./IRequest";
import { IxoValidationError } from "../errors/IxoValidationError";
import CryptoUtils from '../utils/CryptoUtils'

var cryptoUtils = new CryptoUtils();

export class Request {
 
  signature: any;
  payload: string;
  data: any;
  did: string;

  constructor(requestData: any){
    this.payload = JSON.stringify(requestData.payload);
    this.did = requestData.payload.did;
    this.data = requestData.payload.data;
    if(requestData.signature){
      this.signature = requestData.signature;
    }
  }

  hasSignature = ():boolean => {
    return (this.signature != undefined);
  }

  verifySignature = ():boolean => {
    if(!this.hasSignature){
      throw new IxoValidationError("Signature is not present in request");
    }
    if(this.did != this.signature.creator){
      throw new IxoValidationError("'did' in payload is not the signature creator");
    }
    if(!cryptoUtils.validateSignature(this.payload, this.signature.type, this.signature.signature, this.signature.creator)){
      throw new IxoValidationError("Invalid request input signature '" + this.payload);
    }
    return true;
  }

}
