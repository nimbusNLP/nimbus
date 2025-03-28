import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';



import { Platform } from 'aws-cdk-lib/aws-ecr-assets';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

interface NimbusLambdaStackProps extends cdk.StackProps {
  name: string;
}

// THE BELOW IS ANOTHER WAY TO DO IT
// export interface NimbusLambdaStackProps extends cdk.StackProps {
//   name: string;
//   apiId: string;
// }

export class NimbusLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: NimbusLambdaStackProps) {
    super(scope, id, props);

    // I'm very unsure about this code
    // How do we get the name to dynamically come into this stack creation
    const modelName = props?.name || 'default';

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
    const rootResourceId = cdk.Fn.importValue('NimbusRestApiRootResource');

    const api = apigateway.RestApi.fromRestApiAttributes(this, 'ImportedRestApi', {
      restApiId: restApiId,
      rootResourceId: rootResourceId,
    });



    const modelNameRoute = api.root.addResource(modelName);
    const health = modelNameRoute.addResource('health');
    const predict = modelNameRoute.addResource('predict');

    const lambdaIntegration = new apigateway.LambdaIntegration(myLambda);

    predict.addMethod('POST', lambdaIntegration);
    health.addMethod('GET', lambdaIntegration);
    modelNameRoute.addMethod('GET', lambdaIntegration);

    // Replace the existing deployment code with this:
    const deployment = new apigateway.Deployment(this, `${modelName}ApiDeployment`, {
      api: api,
      description: `Deployment for ${modelName} lambda integration`,
      retainDeployments: true,
    });

    // Get reference to existing prod stage
    const prodStage = apigateway.Stage.fromStageAttributes(this, 'ImportedProdStage', {
      restApi: api,
      stageName: 'prod',
    });

    // Create a stage update to point the prod stage to our new deployment
    new apigateway.StageDeployment(this, `${modelName}StageDeployment`, {
      stage: prodStage,
      deployment: deployment,
    });

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