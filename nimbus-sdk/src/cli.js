import { buildPushAndDeployLambda } from "./utilities/lambdaUtils.js";
import { createApi, attachLambdaToApi, deployApi } from "./utilities/apiGateway.js";
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

// A simple command-line parser (expand as needed)
const command = process.argv[2];

async function createLambdaAndAttach() {
  const apiId = getStoredApiId();

  const lambdaName = process.argv[3];

  if (!lambdaName) {
    console.error("Please provide a lambda name.");
    process.exit(1);
  }

  const lambdaArn = await buildPushAndDeployLambda();

  await attachLambdaToApi(apiId, lambdaName, lambdaArn);

  await deployApi(apiId);
}

function getStoredApiId() {
  try {
    const configPath = path.join(__dirname, "api-config.json");
    const configFile = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(configFile);
    return config.apiId;
  } catch (error) {
    console.error("Error loading API configuration. Have you run 'initApi'?");
    process.exit(1);
  }
}

async function initApi() {
  const apiName = "mySdkApi";
  const apiId = await createApi(apiName);
  console.log(`API created with ID: ${apiId}`);

  // Create a config object to store the API ID
  const config = { apiId };

  fs.writeFileSync(path.join(__dirname, "api-config.json"), JSON.stringify(config, null, 2));

  console.log("API configuration saved to api-config.json");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  if (command === "initApi") {
    await initApi();
  } else if (command === "createLambda") {
    await createLambdaAndAttach();
  } else {
    console.log("Usage:");
    console.log("  node cli.js initApi       # Create initial API Gateway");
    console.log("  node cli.js createLambda <lambdaName>  # Create and attach a new Lambda function");
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
