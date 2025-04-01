import { apigateway, lambda, ecr, iam, region } from "../awsConfig";

export async function createApiGateway(apiName: string) {
  const params = {
    name: apiName,
    protocolType: "HTTP",
  }
  
  try {
    const response = await apigateway.createRestApi(params).promise();
    console.log("API Gateway Created:", response);
    return response.id;
  } catch (error) {
    console.error("Error creating API Gateway:", error);
  }
};

export async function createLambdaFunction(
  lambdaName: string,
  ecrRepoUri: string,
  roleArn: string
) {
  const params = {
    FunctionName: lambdaName,
    PackageType: "Image",
    Role: roleArn,
    Code: {
      ImageUri: `${ecrRepoUri}:latest`,
    },
    Timeout: 60,
  };

  try {
    const response = await lambda.createFunction(params).promise();
    console.log("Lambda Created:", response);
    return response.FunctionArn;
  } catch (error) {
    console.error("Error creating Lambda:", error);
  }
}

// last parameter "apiName" is my own addition for creating api if not around
export async function addLambdaToApi(
  apiId: string,
  lambdaName: string,
  lambdaArn: string,
  /*apiName: string*/) {
  try {
    const resources = await apigateway.getResources({ restApiId: apiId }).promise();
    let rootResourceId = resources.items!.find((res) => res.path === "/")!.id;

    // if (!rootResourceId) {
    //   // if API doesn't exist, create the api.
    //   rootResourceId = await createApiGateway(apiName);
    // }

    const resource = await apigateway.createResource({
      restApiId: apiId,
      parentId: rootResourceId as string,
      pathPart: lambdaName,
    }).promise();
 
    await apigateway.putMethod({
      restApiId: apiId,
      resourceId: resource.id!,
      httpMethod: "ANY",
      authorizationType: "NONE",
    }).promise();

    await apigateway.putIntegration({
      restApiId: apiId,
      resourceId: resource.id!,
      httpMethod: "ANY",
      type: "AWS_PROXY",
      integrationHttpMethod: "POST",
      uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`,
    }).promise();

    console.log(`Lambda ${lambdaName} attached to API Gateway at /${lambdaName}`);
  } catch (error) {
    console.error("Error attaching Lambda to API Gateway:", error);
  }
}

export async function deployApiGateway(apiId: string) {
  try {
    const response = await apigateway.createDeployment({
      restApiId: apiId,
      stageName: "prod",
    }).promise();
    console.log("API Gateway Deployed:", response);
  } catch (error) {
    console.error("Error deploying API Gateway:", error);
  }
}