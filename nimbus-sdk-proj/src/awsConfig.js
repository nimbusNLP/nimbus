// src/awsConfig.js
import AWS from "aws-sdk";

// Set region from environment or default to 'us-east-1'
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";

// const region = AWS.config.region;
// console.log('My Region is:', region);
AWS.config.update({ region });

const lambda = new AWS.Lambda();
const apigateway = new AWS.APIGateway();
const ecr = new AWS.ECR();
const iam = new AWS.IAM();
const sts = new AWS.STS();

export { lambda, apigateway, ecr, iam, sts, region };
