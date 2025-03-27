import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';


import * as apigateway from 'aws-cdk-lib/aws-apigateway';


import { Platform } from 'aws-cdk-lib/aws-ecr-assets';

export class NimbusCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const myLambda = new lambda.DockerImageFunction(this, 'myLambdaFunction', {
      code: lambda.DockerImageCode.fromImageAsset(
        path.join(__dirname, '../../nimbus-cli/finished_dir'),
        {
          platform: Platform.LINUX_AMD64,
        }
      ),
      memorySize: 3008,
      timeout: cdk.Duration.seconds(60),
    });

    const api = new apigateway.RestApi(this, 'PredictRestApi', {
      restApiName: 'PredictRestApi',
    });

    const predict = api.root.addResource('predict');

    predict.addMethod('POST', new apigateway.LambdaIntegration(myLambda));

    new cdk.CfnOutput(this, 'RestApiUrl', {
      value: api.url ?? 'Something went wrong',
    });
  }
}
