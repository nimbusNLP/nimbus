import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
interface NimbusLambdaStackProps extends cdk.StackProps {
    name: string;
}
export declare class NimbusLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: NimbusLambdaStackProps);
}
export {};
