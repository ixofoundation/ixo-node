export declare class GitUtils {
    loadFileContents(repo: string, path: string): Promise<string>;
    decodeBase64(encoded: string): any;
    constructUrl(repo: string, path: string): string;
}
declare const _default: GitUtils;
export default _default;
