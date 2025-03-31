import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as path from 'path';
import { Platform } from 'aws-cdk-lib/aws-ecr-assets';

interface ModelConfig {
  modelName: string;
  modelType: string;
  modelPathOrName: string;
}

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const api = new apigateway.RestApi(this, 'PredictRestApi', {
      restApiName: 'PredictRestApi',
      deployOptions: {
        stageName: 'prod',
      },
    });

    const defaultLambda = new lambda.Function(this, 'DefaultLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(
        'exports.handler = async () => { return { statusCode: 200, body: "No model deployed yet." }; }'
      ),
    });
    api.root.addMethod('GET', new apigateway.LambdaIntegration(defaultLambda));

 
    const modelsConfigPath = path.join(__dirname, '../../nimbus-cli', 'finished_dir', 'models.json');
    let models: ModelConfig[] = [];
    if (fs.existsSync(modelsConfigPath)) {
      models = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));
    }

   
    models.forEach((model) => {
      const modelLambda = new lambda.DockerImageFunction(this, `Lambda_${model.modelName}`, {
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../../nimbus-cli', 'finished_dir', model.modelName),
          {
            platform: Platform.LINUX_AMD64,
          }
        ),
        memorySize: 3008,
        timeout: cdk.Duration.seconds(60),
      });

 
      const modelResource = api.root.addResource(model.modelName);
      const predictResource = modelResource.addResource('predict');
      predictResource.addCorsPreflight({
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type'],
      });
      predictResource.addMethod('POST', new apigateway.LambdaIntegration(modelLambda));

    

      new cdk.CfnOutput(this, `ModelEndpoint_${model.modelName}`, {
        value: `${api.url}${model.modelName}/predict`,
      });
    });


    new cdk.CfnOutput(this, 'RestApiUrl', {
      value: api.url,
    });
  }
}
