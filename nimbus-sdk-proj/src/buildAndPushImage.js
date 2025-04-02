// src/buildAndPushImage.js
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { sts, ecr, lambda, region } from "./awsConfig.js";
import { createLambdaExecutionRole } from "./utilities/iamUtils.js";
import { getStoredApiData } from "./utilities/storageUtils.js";
import { getLambdaExecutionRole } from "./utilities/apiGateway.js";

// Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get absolute path to the my-lambda-app directory
const localDirectory = path.join(__dirname, "..", "my-lambda-app");
const repositoryName = "my-lambda-repo";
const imageTag = "latest";

/**
 * Ensure the ECR repository exists; if not, create it.
 */
async function ensureRepositoryExists() {
  try {
    // Try describing the repository
    const { repositories } = await ecr
      .describeRepositories({ repositoryNames: [repositoryName] })
      .promise();
    console.log(`ECR repository '${repositoryName}' already exists.`);
    return repositories[0];
  } catch (err) {
    if (err.code === "RepositoryNotFoundException") {
      console.log(`ECR repository '${repositoryName}' not found. Creating it...`);
      const { repository } = await ecr
        .createRepository({ repositoryName })
        .promise();
      console.log(`Created repository: ${repository.repositoryUri}`);
      return repository;
    } else {
      console.error("Error checking repository existence:", err);
      throw err;
    }
  }
}

async function buildAndPushImage(lambdaName) {
  try {
    // Ensure the repository exists
    const repo = await ensureRepositoryExists();

    // Get AWS Account ID from STS
    const identity = await sts.getCallerIdentity().promise();
    const accountId = identity.Account;
    const repositoryUri = `${accountId}.dkr.ecr.${region}.amazonaws.com/${repositoryName}:${imageTag}`;

    console.log("Authenticating with ECR...");
    execSync(
      `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com`,
      { stdio: "inherit" }
    );

    console.log("Building Docker image...");
    execSync(`docker build -t ${repositoryName} ${localDirectory}`, { stdio: "inherit" });

    console.log("Tagging Docker image...");
    execSync(`docker tag ${repositoryName}:latest ${repositoryUri}`, { stdio: "inherit" });

    console.log("Pushing Docker image to ECR...");
    execSync(`docker push ${repositoryUri}`, { stdio: "inherit" });
    console.log(`Image successfully pushed: ${repositoryUri}`);

    return repositoryUri;
  } catch (error) {
    console.error("Error building or pushing image:", error);
    process.exit(1);
  }
}

async function createLambdaFunction(lambdaName, imageUri) {
  try {
    // Create or retrieve the Lambda execution role based on lambdaName
    const apiName = getStoredApiData('apiName');
    const roleArn = await getLambdaExecutionRole(apiName);

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const params = {
          FunctionName: lambdaName,
          Role: roleArn,
          Code: { ImageUri: imageUri },
          PackageType: "Image",
          Timeout: 15,
        };
        const result = await lambda.createFunction(params).promise();
        console.log("Lambda function deployed:", result.FunctionArn);
        resolve(result.FunctionArn);
      }, 10000)
    })
  } catch (error) {
    console.error("Error creating Lambda function:", error);
    process.exit(1);
  }
}

export async function buildPushAndDeployLambda(lambdaName) {
  const imageUri = await buildAndPushImage(lambdaName);
  const lambdaArn = await createLambdaFunction(lambdaName, imageUri);
  return lambdaArn;
}
