"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NimbusCdkStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const path = require("path");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
class NimbusCdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const myLambda = new lambda.DockerImageFunction(this, 'myLambdaFunction', {
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../../nimbus-cli/finished_dir'), {
                platform: aws_ecr_assets_1.Platform.LINUX_AMD64,
            }),
            memorySize: 3008,
            timeout: cdk.Duration.seconds(60),
        });
        const api = new apigateway.RestApi(this, 'PredictRestApi', {
            restApiName: 'PredictRestApi',
        });
        const predict = api.root.addResource('predict');
        predict.addMethod('POST', new apigateway.LambdaIntegration(myLambda));
        new cdk.CfnOutput(this, 'RestApiUrl', {
            value: api.url ?? 'Something went wrong',
        });
    }
}
exports.NimbusCdkStack = NimbusCdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1jZGstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLGlEQUFpRDtBQUNqRCw2QkFBNkI7QUFHN0IseURBQXlEO0FBR3pELCtEQUFzRDtBQUV0RCxNQUFhLGNBQWUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMzQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBR3hCLE1BQU0sUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN4RSxJQUFJLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLCtCQUErQixDQUFDLEVBQ3JEO2dCQUNFLFFBQVEsRUFBRSx5QkFBUSxDQUFDLFdBQVc7YUFDL0IsQ0FDRjtZQUNELFVBQVUsRUFBRSxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDbEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN6RCxXQUFXLEVBQUUsZ0JBQWdCO1NBQzlCLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWhELE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFdEUsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDcEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksc0JBQXNCO1NBQ3pDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTVCRCx3Q0E0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5cbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG5cbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjci1hc3NldHMnO1xuXG5leHBvcnQgY2xhc3MgTmltYnVzQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIGNvbnN0IG15TGFtYmRhID0gbmV3IGxhbWJkYS5Eb2NrZXJJbWFnZUZ1bmN0aW9uKHRoaXMsICdteUxhbWJkYUZ1bmN0aW9uJywge1xuICAgICAgY29kZTogbGFtYmRhLkRvY2tlckltYWdlQ29kZS5mcm9tSW1hZ2VBc3NldChcbiAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL25pbWJ1cy1jbGkvZmluaXNoZWRfZGlyJyksXG4gICAgICAgIHtcbiAgICAgICAgICBwbGF0Zm9ybTogUGxhdGZvcm0uTElOVVhfQU1ENjQsXG4gICAgICAgIH1cbiAgICAgICksXG4gICAgICBtZW1vcnlTaXplOiAzMDA4LFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnUHJlZGljdFJlc3RBcGknLCB7XG4gICAgICByZXN0QXBpTmFtZTogJ1ByZWRpY3RSZXN0QXBpJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByZWRpY3QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncHJlZGljdCcpO1xuXG4gICAgcHJlZGljdC5hZGRNZXRob2QoJ1BPU1QnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihteUxhbWJkYSkpO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1Jlc3RBcGlVcmwnLCB7XG4gICAgICB2YWx1ZTogYXBpLnVybCA/PyAnU29tZXRoaW5nIHdlbnQgd3JvbmcnLFxuICAgIH0pO1xuICB9XG59XG4iXX0=