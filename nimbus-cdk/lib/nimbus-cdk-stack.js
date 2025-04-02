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
        const finishedDirPath = this.node.tryGetContext('finishedDirPath');
        if (!finishedDirPath || typeof finishedDirPath !== 'string') {
            throw new Error('CDK context variable "finishedDirPath" is required and must be a string.');
        }
        if (!fs.existsSync(finishedDirPath)) {
            console.warn(`Warning: Provided finishedDirPath does not exist: ${finishedDirPath}`);
        }
        const api = new apigateway.RestApi(this, 'PredictRestApi', {
            restApiName: 'PredictRestApi',
            deployOptions: {
                stageName: 'prod',
            },
        });
        const defaultLambda = new lambda.Function(this, 'DefaultLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline('exports.handler = async () => { return { statusCode: 200, body: "No model deployed yet." }; }'),
        });
        api.root.addMethod('GET', new apigateway.LambdaIntegration(defaultLambda));
        const modelsConfigPath = path.join(finishedDirPath, 'models.json');
        let models = [];
        if (fs.existsSync(modelsConfigPath)) {
            try {
                models = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));
            }
            catch (error) {
                console.error(`Error reading or parsing models.json from ${modelsConfigPath}:`, error);
            }
        }
        models.forEach((model) => {
            const modelDirPath = path.join(finishedDirPath, model.modelName);
            if (!fs.existsSync(modelDirPath)) {
                console.warn(`Warning: Model directory does not exist, skipping deployment for ${model.modelName}: ${modelDirPath}`);
                return;
            }
            const modelLambda = new lambda.DockerImageFunction(this, `Lambda_${model.modelName}`, {
                code: lambda.DockerImageCode.fromImageAsset(modelDirPath, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1jZGstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLGlEQUFpRDtBQUNqRCx5REFBeUQ7QUFFekQseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QiwrREFBc0Q7QUFTdEQsTUFBYSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVuRSxJQUFJLENBQUMsZUFBZSxJQUFJLE9BQU8sZUFBZSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzVELE1BQU0sSUFBSSxLQUFLLENBQUMsMEVBQTBFLENBQUMsQ0FBQztRQUM5RixDQUFDO1FBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQztZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFEQUFxRCxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7UUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3pELFdBQVcsRUFBRSxnQkFBZ0I7WUFDN0IsYUFBYSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxNQUFNO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDL0QsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixJ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cm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjci1hc3NldHMnO1xuXG5pbnRlcmZhY2UgTW9kZWxDb25maWcge1xuICBtb2RlbE5hbWU6IHN0cmluZztcbiAgbW9kZWxUeXBlOiBzdHJpbmc7XG4gIG1vZGVsUGF0aE9yTmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEFwaUdhdGV3YXlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGZpbmlzaGVkRGlyUGF0aCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdmaW5pc2hlZERpclBhdGgnKTtcblxuICAgIGlmICghZmluaXNoZWREaXJQYXRoIHx8IHR5cGVvZiBmaW5pc2hlZERpclBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NESyBjb250ZXh0IHZhcmlhYmxlIFwiZmluaXNoZWREaXJQYXRoXCIgaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgYSBzdHJpbmcuJyk7XG4gICAgfVxuICAgIFxuICAgIGlmICghZnMuZXhpc3RzU3luYyhmaW5pc2hlZERpclBhdGgpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFdhcm5pbmc6IFByb3ZpZGVkIGZpbmlzaGVkRGlyUGF0aCBkb2VzIG5vdCBleGlzdDogJHtmaW5pc2hlZERpclBhdGh9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnUHJlZGljdFJlc3RBcGknLCB7XG4gICAgICByZXN0QXBpTmFtZTogJ1ByZWRpY3RSZXN0QXBpJyxcbiAgICAgIGRlcGxveU9wdGlvbnM6IHtcbiAgICAgICAgc3RhZ2VOYW1lOiAncHJvZCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVmYXVsdExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0RlZmF1bHRMYW1iZGEnLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoXG4gICAgICAgICdleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7IHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMCwgYm9keTogXCJObyBtb2RlbCBkZXBsb3llZCB5ZXQuXCIgfTsgfSdcbiAgICAgICksXG4gICAgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihkZWZhdWx0TGFtYmRhKSk7XG5cbiAgICBjb25zdCBtb2RlbHNDb25maWdQYXRoID0gcGF0aC5qb2luKGZpbmlzaGVkRGlyUGF0aCwgJ21vZGVscy5qc29uJyk7XG4gICAgbGV0IG1vZGVsczogTW9kZWxDb25maWdbXSA9IFtdO1xuICAgIFxuICAgIGlmIChmcy5leGlzdHNTeW5jKG1vZGVsc0NvbmZpZ1BhdGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBtb2RlbHMgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhtb2RlbHNDb25maWdQYXRoLCAndXRmOCcpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHJlYWRpbmcgb3IgcGFyc2luZyBtb2RlbHMuanNvbiBmcm9tICR7bW9kZWxzQ29uZmlnUGF0aH06YCwgZXJyb3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1vZGVscy5mb3JFYWNoKChtb2RlbCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWxEaXJQYXRoID0gcGF0aC5qb2luKGZpbmlzaGVkRGlyUGF0aCwgbW9kZWwubW9kZWxOYW1lKTtcbiAgICAgIFxuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKG1vZGVsRGlyUGF0aCkpIHtcbiAgICAgICAgIGNvbnNvbGUud2FybihgV2FybmluZzogTW9kZWwgZGlyZWN0b3J5IGRvZXMgbm90IGV4aXN0LCBza2lwcGluZyBkZXBsb3ltZW50IGZvciAke21vZGVsLm1vZGVsTmFtZX06ICR7bW9kZWxEaXJQYXRofWApO1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCBtb2RlbExhbWJkYSA9IG5ldyBsYW1iZGEuRG9ja2VySW1hZ2VGdW5jdGlvbih0aGlzLCBgTGFtYmRhXyR7bW9kZWwubW9kZWxOYW1lfWAsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkRvY2tlckltYWdlQ29kZS5mcm9tSW1hZ2VBc3NldChcbiAgICAgICAgICBtb2RlbERpclBhdGgsXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLkxJTlVYX0FNRDY0LFxuICAgICAgICAgIH1cbiAgICAgICAgKSxcbiAgICAgICAgbWVtb3J5U2l6ZTogMzAwOCxcbiAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1vZGVsUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZShtb2RlbC5tb2RlbE5hbWUpO1xuICAgICAgY29uc3QgcHJlZGljdFJlc291cmNlID0gbW9kZWxSZXNvdXJjZS5hZGRSZXNvdXJjZSgncHJlZGljdCcpO1xuICAgICAgcHJlZGljdFJlc291cmNlLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcbiAgICAgICAgYWxsb3dNZXRob2RzOiBbJ1BPU1QnLCAnT1BUSU9OUyddLFxuICAgICAgICBhbGxvd0hlYWRlcnM6IFsnQ29udGVudC1UeXBlJ10sXG4gICAgICB9KTtcbiAgICAgIHByZWRpY3RSZXNvdXJjZS5hZGRNZXRob2QoJ1BPU1QnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihtb2RlbExhbWJkYSkpO1xuXG4gICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBgTW9kZWxFbmRwb2ludF8ke21vZGVsLm1vZGVsTmFtZX1gLCB7XG4gICAgICAgIHZhbHVlOiBgJHthcGkudXJsfSR7bW9kZWwubW9kZWxOYW1lfS9wcmVkaWN0YCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1Jlc3RBcGlVcmwnLCB7XG4gICAgICB2YWx1ZTogYXBpLnVybCxcbiAgICB9KTtcbiAgfVxufVxuIl19