import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

// Import alpha modules for HTTP API v2
import {
  HttpApi,
  HttpMethod,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import {
  HttpLambdaIntegration,
} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

// Import the Platform enum
import { Platform } from 'aws-cdk-lib/aws-ecr-assets';

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Force the Docker build to x86_64 (linux/amd64)
    const myLambda = new lambda.DockerImageFunction(this, 'myLambdaFunction', {
      code: lambda.DockerImageCode.fromImageAsset(
        path.join(__dirname, '../../finished_dir'),
        {
          platform: Platform.LINUX_AMD64,
        }
      ),
      memorySize: 3008,
      timeout: cdk.Duration.seconds(60),
    });

    const httpApi = new HttpApi(this, 'PredictHttpApi', {
      apiName: 'PredictHttpApi',
    });

    const lambdaIntegration = new HttpLambdaIntegration(
      'LambdaIntegration',
      myLambda
    );

    httpApi.addRoutes({
      path: '/predict',
      methods: [HttpMethod.POST],
      integration: lambdaIntegration,
    });

    new cdk.CfnOutput(this, 'HttpApiUrl', {
      value: httpApi.url ?? 'Something went wrong',
    });
  }
}
