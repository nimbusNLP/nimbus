import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import * as fs from "fs";
import * as path from "path";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.resolve(__dirname, "../../nimbus-cli/nimbus-config.json");

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
        'CDK context variable "finishedDirPath" is required and must be a string.'
      );
    }

    if (!fs.existsSync(finishedDirPath)) {
      console.warn(
        `❌  Warning: Provided finishedDirPath does not exist: ${finishedDirPath}`
      );
    }

    const api = new apigateway.RestApi(this, "PredictRestApi", {
      restApiName: "PredictRestApi",
      deployOptions: {
        stageName: "prod",
      },
      defaultMethodOptions: {
        apiKeyRequired: true,
      },
    });
    api.root.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: ["GET", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "x-api-key"],
    });

    const modelsPath = JSON.parse(
      fs.readFileSync(CONFIG_PATH, "utf8")
    );
    const modelsJSON = fs.readFileSync(
      path.resolve(modelsPath.localStorage, "finished_dir/models.json"),
      "utf8"
    );

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
            headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
            body: '${JSON.stringify(parsedModels)}'
          };
        };`
      ),
    });
    api.root.addMethod("GET", new apigateway.LambdaIntegration(defaultLambda), {
      apiKeyRequired: true,
    });

    const modelsConfigPath = path.join(finishedDirPath, "models.json");
    let models: ModelConfig[] = [];

    if (fs.existsSync(modelsConfigPath)) {
      try {
        models = JSON.parse(fs.readFileSync(modelsConfigPath, "utf8"));
      } catch (error) {
        console.error(
          `❌  Error reading or parsing models.json from ${modelsConfigPath}:`,
          error
        );
      }
    }

    models.forEach((model) => {
      const modelDirPath = path.join(finishedDirPath, model.modelName);

      if (!fs.existsSync(modelDirPath)) {
        console.warn(
          `❌  Warning: Model directory does not exist, skipping deployment for ${model.modelName}: ${modelDirPath}`
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
        }
      );

      const modelResource = api.root.addResource(model.modelName);
      const predictResource = modelResource.addResource("predict");
      predictResource.addCorsPreflight({
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ["POST", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "x-api-key"],
      });
      predictResource.addMethod(
        "POST",
        new apigateway.LambdaIntegration(modelLambda),
        { apiKeyRequired: true }
      );

      new cdk.CfnOutput(this, `ModelEndpoint_${model.modelName}`, {
        value: `${api.url}${model.modelName}/predict`,
      });
    });

    const apiKey = new apigateway.ApiKey(this, "NimbusApiKey", {
      apiKeyName: "nimbus-api-key",
      description: "API Key for Nimbus services and UI",
    });

    const usagePlan = new apigateway.UsagePlan(this, "NimbusUsagePlan", {
      name: "NimbusUsagePlan",
      description: "Usage plan for Nimbus API",
      apiStages: [
        {
          api: api,
          stage: api.deploymentStage,
        },
      ],
    });

    usagePlan.addApiKey(apiKey);

    new cdk.CfnOutput(this, "ApiKeyId", {
      value: apiKey.keyId,
      description:
        "The ID of the created API Key. Retrieve the value from the AWS Console.",
    });

    new cdk.CfnOutput(this, "RestApiUrl", {
      value: api.url,
    });
  }
}
