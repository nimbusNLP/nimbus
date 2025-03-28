"use strict";
// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as path from 'path';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayStack = void 0;
// import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import { Platform } from 'aws-cdk-lib/aws-ecr-assets';
// export class NimbusCdkStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);
//     const myLambda = new lambda.DockerImageFunction(this, 'myLambdaFunction', {
//       code: lambda.DockerImageCode.fromImageAsset(
//         path.join(__dirname, '../../nimbus-cli/finished_dir'),
//         {
//           platform: Platform.LINUX_AMD64,
//         }
//       ),
//       memorySize: 3008,
//       timeout: cdk.Duration.seconds(60),
//     });
//     const api = new apigateway.RestApi(this, 'PredictRestApi', {
//       restApiName: 'PredictRestApi',
//     });
//     const predict = api.root.addResource('predict');
//     predict.addMethod('POST', new apigateway.LambdaIntegration(myLambda));
//     new cdk.CfnOutput(this, 'RestApiUrl', {
//       value: api.url ?? 'Something went wrong', //should we remove this output?? bc it ouputs the same url twice
//     });
//   }
// }
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const fs = require("fs");
const path = require("path");
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
class ApiGatewayStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Create the API Gateway as a REST API.
        const api = new apigateway.RestApi(this, 'PredictRestApi', {
            restApiName: 'PredictRestApi',
            deployOptions: {
                stageName: 'prod',
            },
        });
        // Add a default route so the API isn't empty.
        const defaultLambda = new lambda.Function(this, 'DefaultLambda', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline('exports.handler = async () => { return { statusCode: 200, body: "No model deployed yet." }; }'),
        });
        api.root.addMethod('GET', new apigateway.LambdaIntegration(defaultLambda));
        // Read the models configuration file.
        const modelsConfigPath = path.join(__dirname, '../../nimbus-cli', 'finished_dir', 'models.json');
        let models = [];
        if (fs.existsSync(modelsConfigPath)) {
            models = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));
        }
        // For each model, create a Docker-based Lambda and add an API route at /<modelName>/predict.
        models.forEach((model) => {
            const modelLambda = new lambda.DockerImageFunction(this, `Lambda_${model.modelName}`, {
                code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../../nimbus-cli', 'finished_dir'), {
                    platform: aws_ecr_assets_1.Platform.LINUX_AMD64,
                }),
                memorySize: 3008,
                timeout: cdk.Duration.seconds(60),
            });
            // Create an API resource for the model.
            const modelResource = api.root.addResource(model.modelName);
            const predictResource = modelResource.addResource('predict');
            predictResource.addMethod('POST', new apigateway.LambdaIntegration(modelLambda));
            // Output the URL for this model's predict endpoint.
            new cdk.CfnOutput(this, `ModelEndpoint_${model.modelName}`, {
                value: `${api.url}${model.modelName}/predict`,
            });
        });
        // Also output the base API Gateway URL.
        new cdk.CfnOutput(this, 'RestApiUrl', {
            value: api.url,
        });
    }
}
exports.ApiGatewayStack = ApiGatewayStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1jZGstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFzQztBQUN0QywwQ0FBMEM7QUFDMUMsb0RBQW9EO0FBQ3BELGdDQUFnQzs7O0FBR2hDLDREQUE0RDtBQUc1RCx5REFBeUQ7QUFFekQsa0RBQWtEO0FBQ2xELHdFQUF3RTtBQUN4RSwrQkFBK0I7QUFHL0Isa0ZBQWtGO0FBQ2xGLHFEQUFxRDtBQUNyRCxpRUFBaUU7QUFDakUsWUFBWTtBQUNaLDRDQUE0QztBQUM1QyxZQUFZO0FBQ1osV0FBVztBQUNYLDBCQUEwQjtBQUMxQiwyQ0FBMkM7QUFDM0MsVUFBVTtBQUVWLG1FQUFtRTtBQUNuRSx1Q0FBdUM7QUFDdkMsVUFBVTtBQUVWLHVEQUF1RDtBQUV2RCw2RUFBNkU7QUFFN0UsOENBQThDO0FBQzlDLG1IQUFtSDtBQUNuSCxVQUFVO0FBQ1YsTUFBTTtBQUNOLElBQUk7QUFHSixtQ0FBbUM7QUFDbkMsaURBQWlEO0FBQ2pELHlEQUF5RDtBQUV6RCx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtEQUFzRDtBQVF0RCxNQUFhLGVBQWdCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDNUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qix3Q0FBd0M7UUFDeEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN6RCxXQUFXLEVBQUUsZ0JBQWdCO1lBQzdCLGFBQWEsRUFBRTtnQkFDYixTQUFTLEVBQUUsTUFBTTthQUNsQjtTQUNGLENBQUMsQ0FBQztRQUVILDhDQUE4QztRQUM5QyxNQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUMvRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FDMUIsK0ZBQStGLENBQ2hHO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFFM0Usc0NBQXNDO1FBQ3RDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ2pHLElBQUksTUFBTSxHQUFrQixFQUFFLENBQUM7UUFDL0IsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztZQUNwQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVELDZGQUE2RjtRQUM3RixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDdkIsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLFVBQVUsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUNwRixJQUFJLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLGNBQWMsQ0FBQyxFQUN4RDtvQkFDRSxRQUFRLEVBQUUseUJBQVEsQ0FBQyxXQUFXO2lCQUMvQixDQUNGO2dCQUNELFVBQVUsRUFBRSxJQUFJO2dCQUNoQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2FBQ2xDLENBQUMsQ0FBQztZQUVILHdDQUF3QztZQUN4QyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUQsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3RCxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRWpGLG9EQUFvRDtZQUNwRCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQzFELEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsVUFBVTthQUM5QyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILHdDQUF3QztRQUN4QyxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNwQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUc7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUExREQsMENBMERDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbi8vIGltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuLy8gaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuLy8gaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuXG4vLyBpbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcblxuXG4vLyBpbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3ItYXNzZXRzJztcblxuLy8gZXhwb3J0IGNsYXNzIE5pbWJ1c0Nka1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbi8vICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuLy8gICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG5cbi8vICAgICBjb25zdCBteUxhbWJkYSA9IG5ldyBsYW1iZGEuRG9ja2VySW1hZ2VGdW5jdGlvbih0aGlzLCAnbXlMYW1iZGFGdW5jdGlvbicsIHtcbi8vICAgICAgIGNvZGU6IGxhbWJkYS5Eb2NrZXJJbWFnZUNvZGUuZnJvbUltYWdlQXNzZXQoXG4vLyAgICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9uaW1idXMtY2xpL2ZpbmlzaGVkX2RpcicpLFxuLy8gICAgICAgICB7XG4vLyAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLkxJTlVYX0FNRDY0LFxuLy8gICAgICAgICB9XG4vLyAgICAgICApLFxuLy8gICAgICAgbWVtb3J5U2l6ZTogMzAwOCxcbi8vICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbi8vICAgICB9KTtcblxuLy8gICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ1ByZWRpY3RSZXN0QXBpJywge1xuLy8gICAgICAgcmVzdEFwaU5hbWU6ICdQcmVkaWN0UmVzdEFwaScsXG4vLyAgICAgfSk7XG5cbi8vICAgICBjb25zdCBwcmVkaWN0ID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3ByZWRpY3QnKTtcblxuLy8gICAgIHByZWRpY3QuYWRkTWV0aG9kKCdQT1NUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obXlMYW1iZGEpKTtcblxuLy8gICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdSZXN0QXBpVXJsJywge1xuLy8gICAgICAgdmFsdWU6IGFwaS51cmwgPz8gJ1NvbWV0aGluZyB3ZW50IHdyb25nJywgLy9zaG91bGQgd2UgcmVtb3ZlIHRoaXMgb3V0cHV0Pz8gYmMgaXQgb3VwdXRzIHRoZSBzYW1lIHVybCB0d2ljZVxuLy8gICAgIH0pO1xuLy8gICB9XG4vLyB9XG5cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyLWFzc2V0cyc7XG5cbmludGVyZmFjZSBNb2RlbENvbmZpZyB7XG4gIG1vZGVsTmFtZTogc3RyaW5nO1xuICBtb2RlbFR5cGU6IHN0cmluZztcbiAgbW9kZWxQYXRoT3JOYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBBcGlHYXRld2F5U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIEFQSSBHYXRld2F5IGFzIGEgUkVTVCBBUEkuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnUHJlZGljdFJlc3RBcGknLCB7XG4gICAgICByZXN0QXBpTmFtZTogJ1ByZWRpY3RSZXN0QXBpJyxcbiAgICAgIGRlcGxveU9wdGlvbnM6IHtcbiAgICAgICAgc3RhZ2VOYW1lOiAncHJvZCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGEgZGVmYXVsdCByb3V0ZSBzbyB0aGUgQVBJIGlzbid0IGVtcHR5LlxuICAgIGNvbnN0IGRlZmF1bHRMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdEZWZhdWx0TGFtYmRhJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE2X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKFxuICAgICAgICAnZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKCkgPT4geyByZXR1cm4geyBzdGF0dXNDb2RlOiAyMDAsIGJvZHk6IFwiTm8gbW9kZWwgZGVwbG95ZWQgeWV0LlwiIH07IH0nXG4gICAgICApLFxuICAgIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZGVmYXVsdExhbWJkYSkpO1xuXG4gICAgLy8gUmVhZCB0aGUgbW9kZWxzIGNvbmZpZ3VyYXRpb24gZmlsZS5cbiAgICBjb25zdCBtb2RlbHNDb25maWdQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL25pbWJ1cy1jbGknLCAnZmluaXNoZWRfZGlyJywgJ21vZGVscy5qc29uJyk7XG4gICAgbGV0IG1vZGVsczogTW9kZWxDb25maWdbXSA9IFtdO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKG1vZGVsc0NvbmZpZ1BhdGgpKSB7XG4gICAgICBtb2RlbHMgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhtb2RlbHNDb25maWdQYXRoLCAndXRmOCcpKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgZWFjaCBtb2RlbCwgY3JlYXRlIGEgRG9ja2VyLWJhc2VkIExhbWJkYSBhbmQgYWRkIGFuIEFQSSByb3V0ZSBhdCAvPG1vZGVsTmFtZT4vcHJlZGljdC5cbiAgICBtb2RlbHMuZm9yRWFjaCgobW9kZWwpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsTGFtYmRhID0gbmV3IGxhbWJkYS5Eb2NrZXJJbWFnZUZ1bmN0aW9uKHRoaXMsIGBMYW1iZGFfJHttb2RlbC5tb2RlbE5hbWV9YCwge1xuICAgICAgICBjb2RlOiBsYW1iZGEuRG9ja2VySW1hZ2VDb2RlLmZyb21JbWFnZUFzc2V0KFxuICAgICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9uaW1idXMtY2xpJywgJ2ZpbmlzaGVkX2RpcicpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybS5MSU5VWF9BTUQ2NCxcbiAgICAgICAgICB9XG4gICAgICAgICksXG4gICAgICAgIG1lbW9yeVNpemU6IDMwMDgsXG4gICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDcmVhdGUgYW4gQVBJIHJlc291cmNlIGZvciB0aGUgbW9kZWwuXG4gICAgICBjb25zdCBtb2RlbFJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UobW9kZWwubW9kZWxOYW1lKTtcbiAgICAgIGNvbnN0IHByZWRpY3RSZXNvdXJjZSA9IG1vZGVsUmVzb3VyY2UuYWRkUmVzb3VyY2UoJ3ByZWRpY3QnKTtcbiAgICAgIHByZWRpY3RSZXNvdXJjZS5hZGRNZXRob2QoJ1BPU1QnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihtb2RlbExhbWJkYSkpO1xuXG4gICAgICAvLyBPdXRwdXQgdGhlIFVSTCBmb3IgdGhpcyBtb2RlbCdzIHByZWRpY3QgZW5kcG9pbnQuXG4gICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBgTW9kZWxFbmRwb2ludF8ke21vZGVsLm1vZGVsTmFtZX1gLCB7XG4gICAgICAgIHZhbHVlOiBgJHthcGkudXJsfSR7bW9kZWwubW9kZWxOYW1lfS9wcmVkaWN0YCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gQWxzbyBvdXRwdXQgdGhlIGJhc2UgQVBJIEdhdGV3YXkgVVJMLlxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdSZXN0QXBpVXJsJywge1xuICAgICAgdmFsdWU6IGFwaS51cmwsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==