// src/cli.js
import { createApi, attachLambdaToApi, deployApi } from "./utilities/apiGateway.js";
import { buildPushAndDeployLambda } from "./buildAndPushImage.js";
import { getStoredApiId, storeApiId } from "./utilities/storageUtils.js";

const command = process.argv[2];

async function initApi() {
  const apiName = "Nimbus";
  const apiId = await createApi(apiName);
  console.log(`API created with ID: ${apiId}`);
  storeApiId(apiId);
  console.log("API configuration saved.");
}

async function createLambdaAndAttach() {
  const lambdaName = process.argv[3];
  if (!lambdaName) {
    console.error("Please provide a lambda name.");
    process.exit(1);
  }
  
  const apiId = getStoredApiId();
  // Build the Docker image, push it to ECR, and create the Lambda function.
  const lambdaArn = await buildPushAndDeployLambda(lambdaName);
  // Attach the Lambda function to the API Gateway and deploy the changes.
  await attachLambdaToApi(apiId, lambdaName, lambdaArn);
  await deployApi(apiId);
  console.log(`Lambda '${lambdaName}' attached to API and API deployed successfully.`);
}

// async function getUrlRoute(modelName) {
//   try {
//     const 
//   }
// }

async function main() {
  if (command === "initApi") {
    await initApi();
  } else if (command === "createLambda") {
    await createLambdaAndAttach();
  } else {
    console.log("Usage:");
    console.log("  node src/cli.js initApi");
    console.log("  node src/cli.js createLambda <lambdaName>");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
