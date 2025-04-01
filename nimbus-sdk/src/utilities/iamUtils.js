// src/utilities/iamUtils.js
import AWS from "aws-sdk";

const iam = new AWS.IAM();

/**
 * Create a Lambda execution role.
 * @param {string} roleName - The name for the new IAM role.
 * @returns {Promise<string>} - Returns the ARN of the created role.
 */
export async function createLambdaExecutionRole(roleName) {
  const assumeRolePolicyDocument = JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { Service: "lambda.amazonaws.com" },
        Action: "sts:AssumeRole",
      },
    ],
  });

  try {
    // Create the role
    const createRoleResponse = await iam.createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: assumeRolePolicyDocument,
      Description: "Role for Lambda function execution",
    }).promise();

    const roleArn = createRoleResponse.Role.Arn;
    console.log("Created Role ARN:", roleArn);

    // Attach the AWSLambdaBasicExecutionRole policy for CloudWatch logging
    await iam.attachRolePolicy({
      RoleName: roleName,
      PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    }).promise();

    console.log("Attached AWSLambdaBasicExecutionRole policy");

    // Return the role ARN to be used when creating the Lambda function
    return roleArn;
  } catch (error) {
    console.error("Error creating Lambda execution role:", error);
    throw error;
  }
}
