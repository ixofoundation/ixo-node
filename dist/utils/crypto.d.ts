export declare class CryptoUtils {
    createNonce(size?: number): string;
    validateSignature(data: String, signature: String, address: String): Boolean;
    hash(input: any): String;
}
declare const _default: CryptoUtils;
export default _default;
