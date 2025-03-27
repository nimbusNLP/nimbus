import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';



import { Platform } from 'aws-cdk-lib/aws-ecr-assets';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

interface NimbusLambdaStackProps extends cdk.StackProps {
  name: string;
}

export class NimbusLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: NimbusLambdaStackProps) {
    super(scope, id, props);

    // I'm very unsure about this code
    // How do we get the name to dynamically come into this stack creation
    const modelName = props!.name;

    const myLambda = new lambda.DockerImageFunction(this, `${modelName}LambdaFunction`, {
      functionName: `${modelName}LambdaFunction`,
      code: lambda.DockerImageCode.fromImageAsset(
        path.join(__dirname, '../../nimbus-cli/finished_dir'),
        {
          platform: Platform.LINUX_AMD64,
        }
      ),
      memorySize: 3008,
      timeout: cdk.Duration.seconds(60),
    });

    const restApiId = cdk.Fn.importValue('NimbusRestApi');
     // 2nd arg may need a separate name, like 'ImportedRestApi'
    const api = apigateway.RestApi.fromRestApiId(this, 'NimbusRestApi', restApiId);


    const modelNameRoute = api.root.addResource(modelName);
    const health = modelNameRoute.addResource('health');
    const predict = modelNameRoute.addResource('predict');

    const lambdaIntegration = new apigateway.LambdaIntegration(myLambda);

    predict.addMethod('POST', lambdaIntegration);
    health.addMethod('GET', lambdaIntegration);
    modelNameRoute.addMethod('GET', lambdaIntegration);

    // Maybe we don't return anything here. 

    new cdk.CfnOutput(this, 'RestApiUrl', {
      value: `
        The following paths can be called using the base URL:
        /${modelName}
        /${modelName}/predict
        /${modelName}/health
      `
      // value: api.url ?? 'Something went wrong',
    });
  }
}