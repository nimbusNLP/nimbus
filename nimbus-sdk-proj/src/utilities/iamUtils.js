// // src/utilities/iamUtils.js
// import { iam } from "../awsConfig.js";

// export async function createLambdaExecutionRole(lambdaName) {
//   // Create a unique role name using the lambdaName
//   const roleName = `lambda-exec-${lambdaName}`;
//   const assumeRolePolicyDocument = JSON.stringify({
//     Version: "2012-10-17",
//     Statement: [
//       {
//         Effect: "Allow",
//         Principal: { Service: "lambda.amazonaws.com" },
//         Action: "sts:AssumeRole",
//       },
//     ],
//   });

//   try {
//     let roleArn;
//     try {
//       // Attempt to create the role
//       const createRoleResponse = await iam.createRole({
//         RoleName: roleName,
//         AssumeRolePolicyDocument: assumeRolePolicyDocument,
//         Description: "Role for Lambda function execution",
//       }).promise();
//       roleArn = createRoleResponse.Role.Arn;
//       console.log("Created Role ARN:", roleArn);
//     } catch (e) {
//       // If role already exists, retrieve it
//       if (e.code === "EntityAlreadyExists") {
//         console.log(`Role ${roleName} already exists. Retrieving ARN...`);
//         const getRoleResponse = await iam.getRole({ RoleName: roleName }).promise();
//         roleArn = getRoleResponse.Role.Arn;
//       } else {
//         throw e;
//       }
//     }
//     // Attach the basic execution policy (if not already attached)
//     await iam.attachRolePolicy({
//       RoleName: roleName,
//       PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
//     }).promise();
//     console.log("Attached AWSLambdaBasicExecutionRole policy to", roleName);
//     return roleArn;
//   } catch (error) {
//     console.error("Error creating Lambda execution role:", error);
//     process.exit(1);
//   }
// }


import { iam } from '../awsConfig.js'

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
        console.log('AHHHHHHHHHHHHHHHHHHHHHHHHHHHHH Role:', role);
        console.log('EEEEEEEEEEEEEEEEEEHHHHHHHHHHHH role.Role:', role.Role);
        console.log('Meh role.Role.Arn:', role.Role.Arn);
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
