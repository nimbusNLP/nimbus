import AWS from "aws-sdk";
export const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
console.log('Your region is:', region);
AWS.config.update({
    region
});
export const lambda = new AWS.Lambda();
export const apigateway = new AWS.APIGateway();
export const ecr = new AWS.ECR();
export const iam = new AWS.IAM();
