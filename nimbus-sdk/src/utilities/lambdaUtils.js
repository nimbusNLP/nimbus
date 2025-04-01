// buildAndPushImage.js
import { execSync } from "child_process";
import { lambda, sts, region } from "../awsConfig.js";

const repositoryName = "my-lambda-repo";
const localDirectory = "./my-lambda-app"; // Directory containing your Dockerfile
const imageTag = "latest";
const lambdaFunctionName = "my-container-lambda";

// Build, tag, and push the image, then create the Lambda function
async function buildAndPushImage() {
  try {
    // Get AWS account ID from STS
    const identity = await sts.getCallerIdentity().promise();
    const accountId = identity.Account;
    const repositoryUri = `${accountId}.dkr.ecr.${region}.amazonaws.com/${repositoryName}:${imageTag}`;

    // Ensure ECR repository exists (optional: create if not exists)

    // Authenticate Docker with ECR
    console.log("Authenticating with ECR...");
    execSync(
      `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com`,
      { stdio: "inherit" }
    );

    // Build Docker image
    console.log("Building Docker image...");
    execSync(`docker build -t ${repositoryName} ${localDirectory}`, { stdio: "inherit" });

    // Tag the image for ECR
    console.log("Tagging Docker image...");
    execSync(`docker tag ${repositoryName}:latest ${repositoryUri}`, { stdio: "inherit" });

    // Push the image to ECR
    console.log("Pushing Docker image to ECR...");
    execSync(`docker push ${repositoryUri}`, { stdio: "inherit" });

    console.log(`Image successfully pushed: ${repositoryUri}`);
    return repositoryUri;
  } catch (error) {
    console.error("Error building or pushing image:", error);
    process.exit(1);
  }
}

async function createLambdaFunction(imageUri) {
  try {
    // Replace the role ARN with your Lambda execution role ARN
    const roleArn = "arn:aws:iam::your-account-id:role/your-lambda-role";

    const params = {
      FunctionName: lambdaFunctionName,
      Role: roleArn,
      Code: { ImageUri: imageUri },
      PackageType: "Image",
      Timeout: 15,
    };

    const response = await lambda.createFunction(params).promise();
    console.log("Lambda function deployed:", response.FunctionArn);
    return response.FunctionArn;
  } catch (error) {
    console.error("Error creating Lambda function:", error);
    process.exit(1);
  }
}

// export async function createLambdaAndAttach() {
//   const apiId = getStoredApiId();

//   const lambdaName = process.argv[3];

//   if (!lambdaName) {
//     console.error("Please provide a lambda name.");
//     process.exit(1);
//   }

//   const lambdaArn = await buildPushAndDeployLambda();

//   await attachLambdaToApi(apiId, lambdaName, lambdaArn);

//   await deployApi(apiId);
// } 

// // Exported function to build image and create Lambda
export async function buildPushAndDeployLambda() {
  const imageUri = await buildAndPushImage();
  const lambdaArn = await createLambdaFunction(imageUri);
  return lambdaArn;
}

// function getStoredApiId() {
//   try {
//     const configPath = path.join(__dirname, "api-config.json");
//     const configFile = fs.readFileSync(configPath, "utf8");
//     const config = JSON.parse(configFile);
//     return config.apiId;
//   } catch (error) {
//     console.error("Error loading API configuration. Have you run 'initApi'?");
//     process.exit(1);
//   }
// }



// if (require.main === module) {
//   (async () => {
//     await buildPushAndDeployLambda();
//   })();
// }
