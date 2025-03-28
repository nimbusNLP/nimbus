import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class NimbusApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'NimbusRestApi', {
      restApiName: 'NimbuRestApi',
      // potentially add an api key
    });

    api.root.addMethod('GET', new apigateway.LambdaIntegration(new lambda.Function(this, 'NimbusLambda', {
      code: lambda.Code.fromInline('exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify({ message: "Welcome to the Nimbus API!" }) }; }'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X, 
    })));

    // potential api key

    new cdk.CfnOutput(this, 'NimbusRestApiId', {
      value: api.restApiId,
      exportName: 'NimbusRestApi' // This is the export name you'll import
    });
    
    new cdk.CfnOutput(this, 'NimbusRestApiRootResource', {
      value: api.restApiRootResourceId,
      exportName: 'NimbusRestApiRootResource'
    }); 

    // potential usagePlan

    new cdk.CfnOutput(this, 'url', {
      value: api.url ?? 'Something went wrong',
    });
  }
}
