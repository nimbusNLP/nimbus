import { Construct } from 'constructs';
/**
 */
export interface GetContextKeyOptions {
    /**
     * The context provider to query.
     */
    readonly provider: string;
    /**
     * Provider-specific properties.
     */
    readonly props?: {
        [key: string]: any;
    };
    /**
     * Whether to include the stack's account and region automatically.
     *
     * @default true
     */
    readonly includeEnvironment?: boolean;
}
/**
 */
export interface GetContextValueOptions extends GetContextKeyOptions {
    /**
     * The value to return if the context value was not found and a missing
     * context is reported.
     */
    readonly dummyValue: any;
    /**
     * When True, the context provider will not throw an error if missing context
     * is reported
     *
     * @default false
     */
    readonly ignoreErrorOnMissingContext?: boolean;
}
/**
 */
export interface GetContextKeyResult {
    readonly key: string;
    readonly props: {
        [key: string]: any;
    };
}
/**
 */
export interface GetContextValueResult {
    readonly value?: any;
}
/**
 * Base class for the model side of context providers
 *
 * Instances of this class communicate with context provider plugins in the 'cdk
 * toolkit' via context variables (input), outputting specialized queries for
 * more context variables (output).
 *
 * ContextProvider needs access to a Construct to hook into the context mechanism.
 *
 */
export declare class ContextProvider {
    /**
     * @returns the context key or undefined if a key cannot be rendered (due to tokens used in any of the props)
     */
    static getKey(scope: Construct, options: GetContextKeyOptions): GetContextKeyResult;
    static getValue(scope: Construct, options: GetContextValueOptions): GetContextValueResult;
    private constructor();
}
