// src/cli.js
import { createApi, attachLambdaToApi, deployApi } from "./utilities/apiGateway.js";
import { buildPushAndDeployLambda } from "./buildAndPushImage.js";
import { getStoredApiData, storeApiData } from "./utilities/storageUtils.js";
import { createLambdaExecutionRole } from "./utilities/apiGateway.js";

const command = process.argv[2];

async function initApi() {
  const apiName = process.argv[3];
  if (!apiName) {
    console.error("Please provide an API name.");
    process.exit(1);
  }

  const apiId = await createApi(apiName);
  console.log(`API created with ID: ${apiId}`);
  const roleArn = await createLambdaExecutionRole(apiName);
  console.log(`Execution role created for this API's Lambdas!`);
  storeApiData(apiId, apiName, roleArn);
  console.log("API configuration saved.");
}

async function createLambdaAndAttach() {
  const lambdaName = process.argv[3];
  if (!lambdaName) {
    console.error("Please provide a lambda name.");
    process.exit(1);
  }
  
  const apiId = getStoredApiData('apiId');
  // Build the Docker image, push it to ECR, and create the Lambda function.
  const lambdaArn = await buildPushAndDeployLambda(lambdaName);
  // Attach the Lambda function to the API Gateway and deploy the changes.
  await attachLambdaToApi(apiId, lambdaName, lambdaArn);
  await deployApi(apiId);
  console.log(`Lambda '${lambdaName}' attached to API and API deployed successfully.`);
}

// Write a function for getting the Url Route associated with the API Or Lambda Specifically

// async function getUrlRoute(modelName) {
//   try {
//     const 
//   }
// }

// Write a function to return a list of current APIs
// Write a function to return a list of current models for the API

async function main() {
  if (command === "initApi") {
    await initApi();
  } else if (command === "createLambda") {
    await createLambdaAndAttach();
  } else {
    console.log("Usage:");
    console.log("  node src/cli.js initApi <apiName>");
    console.log("  node src/cli.js createLambda <lambdaName>");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
