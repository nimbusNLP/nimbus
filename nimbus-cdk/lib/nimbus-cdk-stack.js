"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const fs = require("fs");
const path = require("path");
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
class ApiGatewayStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new apigateway.RestApi(this, 'PredictRestApi', {
            restApiName: 'PredictRestApi',
            deployOptions: {
                stageName: 'prod',
            },
        });
        const defaultLambda = new lambda.Function(this, 'DefaultLambda', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline('exports.handler = async () => { return { statusCode: 200, body: "No model deployed yet." }; }'),
        });
        api.root.addMethod('GET', new apigateway.LambdaIntegration(defaultLambda));
        const modelsConfigPath = path.join(__dirname, '../../nimbus-cli', 'finished_dir', 'models.json');
        let models = [];
        if (fs.existsSync(modelsConfigPath)) {
            models = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));
        }
        models.forEach((model) => {
            const modelLambda = new lambda.DockerImageFunction(this, `Lambda_${model.modelName}`, {
                code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../../nimbus-cli', 'finished_dir', model.modelName), {
                    platform: aws_ecr_assets_1.Platform.LINUX_AMD64,
                }),
                memorySize: 3008,
                timeout: cdk.Duration.seconds(60),
            });
            const modelResource = api.root.addResource(model.modelName);
            const predictResource = modelResource.addResource('predict');
            predictResource.addCorsPreflight({
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: ['POST', 'OPTIONS'],
                allowHeaders: ['Content-Type'],
            });
            predictResource.addMethod('POST', new apigateway.LambdaIntegration(modelLambda));
            new cdk.CfnOutput(this, `ModelEndpoint_${model.modelName}`, {
                value: `${api.url}${model.modelName}/predict`,
            });
        });
        new cdk.CfnOutput(this, 'RestApiUrl', {
            value: api.url,
        });
    }
}
exports.ApiGatewayStack = ApiGatewayStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1jZGstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLGlEQUFpRDtBQUNqRCx5REFBeUQ7QUFFekQseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QiwrREFBc0Q7QUFRdEQsTUFBYSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFHeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN6RCxXQUFXLEVBQUUsZ0JBQWdCO1lBQzdCLGFBQWEsRUFBRTtnQkFDYixTQUFTLEVBQUUsTUFBTTthQUNsQjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQy9ELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUMxQiwrRkFBK0YsQ0FDaEc7U0FDRixDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUczRSxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNqRyxJQUFJLE1BQU0sR0FBa0IsRUFBRSxDQUFDO1FBQy9CLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7WUFDcEMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFHRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDdkIsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLFVBQVUsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUNwRixJQUFJLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQ3pFO29CQUNFLFFBQVEsRUFBRSx5QkFBUSxDQUFDLFdBQVc7aUJBQy9CLENBQ0Y7Z0JBQ0QsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7YUFDbEMsQ0FBQyxDQUFDO1lBR0gsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVELE1BQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0QsZUFBZSxDQUFDLGdCQUFnQixDQUFDO2dCQUMvQixZQUFZLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUN6QyxZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDO2dCQUNqQyxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUM7YUFDL0IsQ0FBQyxDQUFDO1lBQ0gsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUlqRixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQzFELEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsVUFBVTthQUM5QyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUdILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3BDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQS9ERCwwQ0ErREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3ItYXNzZXRzJztcblxuaW50ZXJmYWNlIE1vZGVsQ29uZmlnIHtcbiAgbW9kZWxOYW1lOiBzdHJpbmc7XG4gIG1vZGVsVHlwZTogc3RyaW5nO1xuICBtb2RlbFBhdGhPck5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEFwaUdhdGV3YXlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnUHJlZGljdFJlc3RBcGknLCB7XG4gICAgICByZXN0QXBpTmFtZTogJ1ByZWRpY3RSZXN0QXBpJyxcbiAgICAgIGRlcGxveU9wdGlvbnM6IHtcbiAgICAgICAgc3RhZ2VOYW1lOiAncHJvZCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVmYXVsdExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0RlZmF1bHRMYW1iZGEnLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTZfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoXG4gICAgICAgICdleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7IHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMCwgYm9keTogXCJObyBtb2RlbCBkZXBsb3llZCB5ZXQuXCIgfTsgfSdcbiAgICAgICksXG4gICAgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihkZWZhdWx0TGFtYmRhKSk7XG5cbiBcbiAgICBjb25zdCBtb2RlbHNDb25maWdQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL25pbWJ1cy1jbGknLCAnZmluaXNoZWRfZGlyJywgJ21vZGVscy5qc29uJyk7XG4gICAgbGV0IG1vZGVsczogTW9kZWxDb25maWdbXSA9IFtdO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKG1vZGVsc0NvbmZpZ1BhdGgpKSB7XG4gICAgICBtb2RlbHMgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhtb2RlbHNDb25maWdQYXRoLCAndXRmOCcpKTtcbiAgICB9XG5cbiAgIFxuICAgIG1vZGVscy5mb3JFYWNoKChtb2RlbCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWxMYW1iZGEgPSBuZXcgbGFtYmRhLkRvY2tlckltYWdlRnVuY3Rpb24odGhpcywgYExhbWJkYV8ke21vZGVsLm1vZGVsTmFtZX1gLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Eb2NrZXJJbWFnZUNvZGUuZnJvbUltYWdlQXNzZXQoXG4gICAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL25pbWJ1cy1jbGknLCAnZmluaXNoZWRfZGlyJywgbW9kZWwubW9kZWxOYW1lKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwbGF0Zm9ybTogUGxhdGZvcm0uTElOVVhfQU1ENjQsXG4gICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgICBtZW1vcnlTaXplOiAzMDA4LFxuICAgICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICB9KTtcblxuIFxuICAgICAgY29uc3QgbW9kZWxSZXNvdXJjZSA9IGFwaS5yb290LmFkZFJlc291cmNlKG1vZGVsLm1vZGVsTmFtZSk7XG4gICAgICBjb25zdCBwcmVkaWN0UmVzb3VyY2UgPSBtb2RlbFJlc291cmNlLmFkZFJlc291cmNlKCdwcmVkaWN0Jyk7XG4gICAgICBwcmVkaWN0UmVzb3VyY2UuYWRkQ29yc1ByZWZsaWdodCh7XG4gICAgICAgIGFsbG93T3JpZ2luczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9PUklHSU5TLFxuICAgICAgICBhbGxvd01ldGhvZHM6IFsnUE9TVCcsICdPUFRJT05TJ10sXG4gICAgICAgIGFsbG93SGVhZGVyczogWydDb250ZW50LVR5cGUnXSxcbiAgICAgIH0pO1xuICAgICAgcHJlZGljdFJlc291cmNlLmFkZE1ldGhvZCgnUE9TVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKG1vZGVsTGFtYmRhKSk7XG5cbiAgICBcblxuICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgYE1vZGVsRW5kcG9pbnRfJHttb2RlbC5tb2RlbE5hbWV9YCwge1xuICAgICAgICB2YWx1ZTogYCR7YXBpLnVybH0ke21vZGVsLm1vZGVsTmFtZX0vcHJlZGljdGAsXG4gICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1Jlc3RBcGlVcmwnLCB7XG4gICAgICB2YWx1ZTogYXBpLnVybCxcbiAgICB9KTtcbiAgfVxufVxuIl19