import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class NimbusApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'NimbusRestApi', {
      restApiName: 'NimbuRestApi',
      // potentially add an api key
    });

    // potential api key

    // potential usagePlan

    new cdk.CfnOutput(this, 'RestApiUrl', {
      value: api.url ?? 'Something went wrong',
    });
  }
}