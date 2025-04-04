import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import * as fs from "fs";
import * as path from "path";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";

interface ModelConfig {
  modelName: string;
  modelType: string;
  modelPathOrName: string;
  description?: string;
}

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const finishedDirPath = this.node.tryGetContext("finishedDirPath");

    if (!finishedDirPath || typeof finishedDirPath !== "string") {
      throw new Error(
        'CDK context variable "finishedDirPath" is required and must be a string.',
      );
    }

    if (!fs.existsSync(finishedDirPath)) {
      console.warn(
        `Warning: Provided finishedDirPath does not exist: ${finishedDirPath}`,
      );
    }

    const api = new apigateway.RestApi(this, "PredictRestApi", {
      restApiName: "PredictRestApi",
      deployOptions: {
        stageName: "prod",
      },
    });
    
    const modelsPath = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../nimbus-cli/nimbus-config.json'), 'utf8'));
    const modelsJSON = fs.readFileSync(path.resolve(modelsPath.localStorage, 'finished_dir/models.json'), 'utf8');

    interface ModelEntry {
      modelName: string;
      modelType: string;
      modelPathOrName: string;
      description: string;
    }
    
    const parsedModels: Record<string, string[]> = { models: [] };
    
    (JSON.parse(modelsJSON) as ModelEntry[]).forEach((obj) => {
      parsedModels.models.push(obj.modelName);
    });

    const defaultLambda = new lambda.Function(this, "DefaultLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(
        `exports.handler = async () => {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: '${JSON.stringify(parsedModels)}'
          };
        };`,
      ),
    });
    api.root.addMethod("GET", new apigateway.LambdaIntegration(defaultLambda));

    const modelsConfigPath = path.join(finishedDirPath, "models.json");
    let models: ModelConfig[] = [];

    if (fs.existsSync(modelsConfigPath)) {
      try {
        models = JSON.parse(fs.readFileSync(modelsConfigPath, "utf8"));
      } catch (error) {
        console.error(
          `Error reading or parsing models.json from ${modelsConfigPath}:`,
          error,
        );
      }
    }

    models.forEach((model) => {
      const modelDirPath = path.join(finishedDirPath, model.modelName);

      if (!fs.existsSync(modelDirPath)) {
        console.warn(
          `Warning: Model directory does not exist, skipping deployment for ${model.modelName}: ${modelDirPath}`,
        );
        return;
      }

      const modelLambda = new lambda.DockerImageFunction(
        this,
        `Lambda_${model.modelName}`,
        {
          code: lambda.DockerImageCode.fromImageAsset(modelDirPath, {
            platform: Platform.LINUX_AMD64,
          }),
          memorySize: 3008,
          timeout: cdk.Duration.seconds(60),
        },
      );

      const modelResource = api.root.addResource(model.modelName);
      const predictResource = modelResource.addResource("predict");
      predictResource.addCorsPreflight({
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ["POST", "OPTIONS"],
        allowHeaders: ["Content-Type"],
      });
      predictResource.addMethod(
        "POST",
        new apigateway.LambdaIntegration(modelLambda),
      );

      new cdk.CfnOutput(this, `ModelEndpoint_${model.modelName}`, {
        value: `${api.url}${model.modelName}/predict`,
      });
    });

    new cdk.CfnOutput(this, "RestApiUrl", {
      value: api.url,
    });
  }
}
