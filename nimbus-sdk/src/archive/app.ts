import { createApiGateway, createLambdaFunction, addLambdaToApi, deployApiGateway } from "./utilities";


// const args = process.argv;

// console.log('all of your arguments are:', args);

// const command = process.argv[2];

const apiName = "MySDKApi";
const lambdaName = "MySDKLambda";
const ecrRepoUri = "306072245922.dkr.ecr.us-east-1.amazonaws.com/myrepo";
const roleArn = "arn:aws:iam::306072245922:role/mySdkLambdaRole";

(async () => {
  const apiId = await createApiGateway(apiName);
  const lambdaArn = await createLambdaFunction(lambdaName, ecrRepoUri, roleArn);
  await addLambdaToApi(apiId, lambdaName, lambdaArn);
  await deployApiGateway(apiId);
})();