// src/utilities/apiGateway.js
import { apigateway, region, lambda, iam } from "../awsConfig.js";


// create API and LambdaExecutionRole
export async function createApi(apiName) {
  try {
    const response = await apigateway.createRestApi({ name: apiName }).promise();
    console.log("API Gateway Created:", response.id);
    console.log('The API object is:', response);
    return response.id;
  } catch (error) {
    console.error("Error creating API Gateway:", error);
    process.exit(1);
  }
}

export async function createLambdaExecutionRole(roleName) {
  const assumeRolePolicyDocument = JSON.stringify({
      Version: "2012-10-17",
      Statement: [
          {
              Effect: "Allow",
              Principal: {
                  Service: "lambda.amazonaws.com"
              },
              Action: "sts:AssumeRole"
          }
      ]
  });

  try {
      // Create the IAM Role
      const role = await iam.createRole({
          RoleName: roleName,
          AssumeRolePolicyDocument: assumeRolePolicyDocument
      }).promise();

      console.log(`Created Role ARN: ${role.Role.Arn}`);

      // Attach AWSLambdaBasicExecutionRole Policy (for CloudWatch Logs)
      await iam.attachRolePolicy({
          RoleName: roleName,
          PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
      }).promise();

      console.log(`Attached AWSLambdaBasicExecutionRole policy to ${roleName}`);

      return role.Role.Arn;
  } catch (error) {
      if (error.code === 'EntityAlreadyExists') {
          console.log(`Role ${roleName} already exists.`);

          const existingRole = await iam.getRole({ RoleName: roleName }).promise();
          return existingRole.Role.Arn;
      } else {
          console.error(`Error creating role: ${error.message}`);
      }
  }
}

export async function getLambdaExecutionRole(roleName) {
  try {
    const roleData = await iam.getRole({ RoleName: roleName }).promise();
    console.log(`Reusing existing role ${roleData.Role.Arn}`);
    return roleData.Role.Arn;
  } catch (error) {
    if (error.code === "NoSuchEntity") {
      console.log(`Role ${roleName} does not exist.`)
    } else {
      throw error;
    }
  }
} 

export async function attachLambdaToApi(apiId, lambdaName, lambdaArn) {
  try {
    // Get the root resource ("/")

    const lambdaFunctionName = lambdaArn.split(":").pop();
    const resources = await apigateway.getResources({ restApiId: apiId }).promise();
    const rootResource = resources.items.find((r) => r.path === "/");
    if (!rootResource) throw new Error("Root resource not found");

    // Create a new resource for the lambdaName
    const resource = await apigateway.createResource({
      restApiId: apiId,
      parentId: rootResource.id,
      pathPart: lambdaName,
    }).promise();

    // Create ANY method on the new resource
    await apigateway.putMethod({
      restApiId: apiId,
      resourceId: resource.id,
      httpMethod: "POST",
      authorizationType: "NONE",
    }).promise();

    // Set up the Lambda proxy integration
    await apigateway.putIntegration({
      restApiId: apiId,
      resourceId: resource.id,
      httpMethod: "POST",
      type: "AWS_PROXY",
      integrationHttpMethod: "POST",
      uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`,
    }).promise();

    await lambda.addPermission({
      FunctionName: lambdaFunctionName,
      StatementId: `apigateway-${lambdaName}`,
      Action: "lambda:InvokeFunction",
      Principal: "apigateway.amazonaws.com",
      SourceArn: `arn:aws:execute-api:${region}:${lambdaArn.split(":")[4]}:${apiId}/*/*/${lambdaName}`,
    }).promise();

    console.log(`Lambda ${lambdaName} attached to API Gateway at path /${lambdaName}`);
  } catch (error) {
    console.error("Error attaching Lambda to API Gateway:", error);
    process.exit(1);
  }
}

export async function deployApi(apiId, stageName = "prod") {
  try {
    const response = await apigateway.createDeployment({
      restApiId: apiId,
      stageName,
    }).promise();
    console.log("API Gateway Deployed:", response.id);
  } catch (error) {
    console.error("Error deploying API Gateway:", error);
    process.exit(1);
  }
}
