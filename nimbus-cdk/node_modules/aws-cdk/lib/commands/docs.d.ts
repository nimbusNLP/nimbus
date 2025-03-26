export declare const command = "docs";
export declare const describe = "Opens the reference documentation in a browser";
export declare const aliases: string[];
/**
 * Options for the docs command
 */
export interface DocsOptions {
    /**
     * The command to use to open the browser
     */
    browser: string;
}
export declare function docs(options: DocsOptions): Promise<number>;
