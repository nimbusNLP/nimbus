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
