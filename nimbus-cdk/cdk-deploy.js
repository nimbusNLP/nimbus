#!/usr/bin/env node

// Simple CDK deployment script that bypasses TypeScript compilation
const cdk = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const { Platform } = require('aws-cdk-lib/aws-ecr-assets');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Clean up any existing CDK processes that might be locking cdk.out
try {
  console.log('Checking for existing CDK processes...');
  // Find any processes that might be locking cdk.out
  const findCmd = process.platform === 'win32' 
    ? 'tasklist | findstr cdk'
    : 'ps aux | grep cdk | grep -v grep';
  
  const output = execSync(findCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  console.log('Found CDK processes:', output);
  
  // We won't kill processes automatically as that could be dangerous
  console.log('If deployment fails due to locked cdk.out, you may need to manually kill these processes');
} catch (error) {
  // Ignore errors from the find command
  console.log('No existing CDK processes found or error checking processes');
}

class ApiGatewayStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Get the finishedDirPath from context or use a default value
    let finishedDirPath = this.node.tryGetContext("finishedDirPath") || process.env.FINISHED_DIR_PATH;

    if (!finishedDirPath || typeof finishedDirPath !== "string") {
      console.error('❌  Warning: CDK context variable "finishedDirPath" is not provided.');
      console.error('Using fallback directory path.');
      // Use a fallback path
      finishedDirPath = path.resolve(process.cwd(), '../finished_dir');
    }

    console.log(`Using finishedDirPath: ${finishedDirPath}`);

    if (!fs.existsSync(finishedDirPath)) {
      console.warn(
        `❌  Warning: Provided finishedDirPath does not exist: ${finishedDirPath}`
      );
      // Create the directory if it doesn't exist
      try {
        fs.mkdirSync(finishedDirPath, { recursive: true });
        console.log(`Created finishedDirPath: ${finishedDirPath}`);
      } catch (error) {
        console.error(`Failed to create finishedDirPath: ${error}`);
      }
    }

    const api = new apigateway.RestApi(this, "PredictRestApi", {
      restApiName: "PredictRestApi",
      deployOptions: {
        stageName: "prod",
      },
    });
    
    api.root.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: ["GET", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    });
    
    // Use a hardcoded path to avoid issues with path resolution
    const configPath = path.resolve(__dirname, '../nimbus-cli/nimbus-config.json');
    console.log(`Looking for config file at: ${configPath}`);
    
    let modelsPath;
    try {
      modelsPath = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log(`Found config file with localStorage path: ${modelsPath.localStorage}`);
    } catch (error) {
      console.error(`Error reading config file: ${error}`);
      // Fallback to using the finishedDirPath directly
      modelsPath = { localStorage: path.dirname(finishedDirPath) };
      console.log(`Using fallback localStorage path: ${modelsPath.localStorage}`);
    }
    
    // Use the finishedDirPath directly for models.json
    const modelsJSONPath = path.join(finishedDirPath, 'models.json');
    console.log(`Looking for models.json at: ${modelsJSONPath}`);
    
    let modelsJSON;
    try {
      if (fs.existsSync(modelsJSONPath)) {
        modelsJSON = fs.readFileSync(modelsJSONPath, 'utf8');
        console.log(`Found models.json file`);
      } else {
        // If models.json doesn't exist, create an empty array
        modelsJSON = '[]';
        console.log(`models.json not found, using empty array`);
      }
    } catch (error) {
      console.error(`Error reading models.json: ${error}`);
      // Fallback to empty array
      modelsJSON = '[]';
      console.log(`Error reading models.json, using empty array`);
    }
    
    const parsedModels = { models: [] };
    
    try {
      JSON.parse(modelsJSON).forEach((obj) => {
        parsedModels.models.push(obj.modelName);
      });
    } catch (error) {
      console.error(`Error parsing models.json: ${error}`);
    }

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
    
    api.root.addMethod("GET", new apigateway.LambdaIntegration(defaultLambda));

    const modelsConfigPath = path.join(finishedDirPath, "models.json");
    let models = [];

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
        allowHeaders: ["Content-Type"],
      });
      
      predictResource.addMethod(
        "POST",
        new apigateway.LambdaIntegration(modelLambda)
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

// Create and run the CDK app
const app = new cdk.App();
new ApiGatewayStack(app, 'ApiGatewayStack', {});
app.synth();
