// utilities/apiGateway.js
import { apigateway } from "../awsConfig.js";

// Create an API Gateway (REST API)
export async function createApi(apiName) {
  try {
    const response = await apigateway.createRestApi({ name: apiName }).promise();
    console.log("API Gateway Created:", response.id);
    return response.id;
  } catch (error) {
    console.error("Error creating API Gateway:", error);
    throw error;
  }
}

// Attach Lambda to API Gateway by creating a new resource and method
export async function attachLambdaToApi(apiId, lambdaName, lambdaArn) {
  try {
    // Get the root resource ID
    const resources = await apigateway.getResources({ restApiId: apiId }).promise();
    const rootResource = resources.items.find((res) => res.path === "/");
    if (!rootResource) throw new Error("Root resource not found.");

    // Create a new resource with the lambda name as the path
    const resource = await apigateway.createResource({
      restApiId: apiId,
      parentId: rootResource.id,
      pathPart: lambdaName,
    }).promise();

    // Create a method on the new resource
    await apigateway.putMethod({
      restApiId: apiId,
      resourceId: resource.id,
      httpMethod: "ANY",
      authorizationType: "NONE",
    }).promise();

    // Set up AWS_PROXY integration with the Lambda function
    await apigateway.putIntegration({
      restApiId: apiId,
      resourceId: resource.id,
      httpMethod: "ANY",
      type: "AWS_PROXY",
      integrationHttpMethod: "POST",
      uri: `arn:aws:apigateway:${apigateway.config.region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`,
    }).promise();

    console.log(`Lambda ${lambdaName} attached to API Gateway at /${lambdaName}`);
  } catch (error) {
    console.error("Error attaching Lambda to API Gateway:", error);
    throw error;
  }
}

// Deploy the API Gateway
export async function deployApi(apiId, stageName = "prod") {
  try {
    const deployment = await apigateway.createDeployment({
      restApiId: apiId,
      stageName,
    }).promise();
    console.log("API Gateway Deployed:", deployment.id);
  } catch (error) {
    console.error("Error deploying API Gateway:", error);
    throw error;
  }
}

// export async function initApi() {
//   const apiName = "mySdkApi";
//   const apiId = await createApi(apiName);
//   console.log(`API created with ID: ${apiId}`);

//   // Create a config object to store the API ID
//   const config = { apiId };

//   fs.writeFileSync(path.join(__dirname, "api-config.json"), JSON.stringify(config, null, 2));

//   console.log("API configuration saved to api-config.json");
// }