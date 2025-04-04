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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9uaW1idXMtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyxpREFBaUQ7QUFDakQseURBQXlEO0FBRXpELHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsK0RBQXNEO0FBU3RELE1BQWEsZUFBZ0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUM1QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFbkUsSUFBSSxDQUFDLGVBQWUsSUFBSSxPQUFPLGVBQWUsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM1RCxNQUFNLElBQUksS0FBSyxDQUFDLDBFQUEwRSxDQUFDLENBQUM7UUFDOUYsQ0FBQztRQUVELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7WUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQyxxREFBcUQsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUN2RixDQUFDO1FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN6RCxXQUFXLEVBQUUsZ0JBQWdCO1lBQzdCLGFBQWEsRUFBRTtnQkFDYixTQUFTLEVBQUUsTUFBTTthQUNsQjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQy9ELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVB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KiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3ItYXNzZXRzJztcblxuaW50ZXJmYWNlIE1vZGVsQ29uZmlnIHtcbiAgbW9kZWxOYW1lOiBzdHJpbmc7XG4gIG1vZGVsVHlwZTogc3RyaW5nO1xuICBtb2RlbFBhdGhPck5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBBcGlHYXRld2F5U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBmaW5pc2hlZERpclBhdGggPSB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dCgnZmluaXNoZWREaXJQYXRoJyk7XG5cbiAgICBpZiAoIWZpbmlzaGVkRGlyUGF0aCB8fCB0eXBlb2YgZmluaXNoZWREaXJQYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDREsgY29udGV4dCB2YXJpYWJsZSBcImZpbmlzaGVkRGlyUGF0aFwiIGlzIHJlcXVpcmVkIGFuZCBtdXN0IGJlIGEgc3RyaW5nLicpO1xuICAgIH1cbiAgICBcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZmluaXNoZWREaXJQYXRoKSkge1xuICAgICAgY29uc29sZS53YXJuKGBXYXJuaW5nOiBQcm92aWRlZCBmaW5pc2hlZERpclBhdGggZG9lcyBub3QgZXhpc3Q6ICR7ZmluaXNoZWREaXJQYXRofWApO1xuICAgIH1cblxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ1ByZWRpY3RSZXN0QXBpJywge1xuICAgICAgcmVzdEFwaU5hbWU6ICdQcmVkaWN0UmVzdEFwaScsXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XG4gICAgICAgIHN0YWdlTmFtZTogJ3Byb2QnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlZmF1bHRMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdEZWZhdWx0TGFtYmRhJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKFxuICAgICAgICAnZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKCkgPT4geyByZXR1cm4geyBzdGF0dXNDb2RlOiAyMDAsIGJvZHk6IFwiTm8gbW9kZWwgZGVwbG95ZWQgeWV0LlwiIH07IH0nXG4gICAgICApLFxuICAgIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZGVmYXVsdExhbWJkYSkpO1xuXG4gICAgY29uc3QgbW9kZWxzQ29uZmlnUGF0aCA9IHBhdGguam9pbihmaW5pc2hlZERpclBhdGgsICdtb2RlbHMuanNvbicpO1xuICAgIGxldCBtb2RlbHM6IE1vZGVsQ29uZmlnW10gPSBbXTtcbiAgICBcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhtb2RlbHNDb25maWdQYXRoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbW9kZWxzID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMobW9kZWxzQ29uZmlnUGF0aCwgJ3V0ZjgnKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciByZWFkaW5nIG9yIHBhcnNpbmcgbW9kZWxzLmpzb24gZnJvbSAke21vZGVsc0NvbmZpZ1BhdGh9OmAsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtb2RlbHMuZm9yRWFjaCgobW9kZWwpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsRGlyUGF0aCA9IHBhdGguam9pbihmaW5pc2hlZERpclBhdGgsIG1vZGVsLm1vZGVsTmFtZSk7XG4gICAgICBcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhtb2RlbERpclBhdGgpKSB7XG4gICAgICAgICBjb25zb2xlLndhcm4oYFdhcm5pbmc6IE1vZGVsIGRpcmVjdG9yeSBkb2VzIG5vdCBleGlzdCwgc2tpcHBpbmcgZGVwbG95bWVudCBmb3IgJHttb2RlbC5tb2RlbE5hbWV9OiAke21vZGVsRGlyUGF0aH1gKTtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgbW9kZWxMYW1iZGEgPSBuZXcgbGFtYmRhLkRvY2tlckltYWdlRnVuY3Rpb24odGhpcywgYExhbWJkYV8ke21vZGVsLm1vZGVsTmFtZX1gLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Eb2NrZXJJbWFnZUNvZGUuZnJvbUltYWdlQXNzZXQoXG4gICAgICAgICAgbW9kZWxEaXJQYXRoLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybS5MSU5VWF9BTUQ2NCxcbiAgICAgICAgICB9XG4gICAgICAgICksXG4gICAgICAgIG1lbW9yeVNpemU6IDMwMDgsXG4gICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtb2RlbFJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UobW9kZWwubW9kZWxOYW1lKTtcbiAgICAgIGNvbnN0IHByZWRpY3RSZXNvdXJjZSA9IG1vZGVsUmVzb3VyY2UuYWRkUmVzb3VyY2UoJ3ByZWRpY3QnKTtcbiAgICAgIHByZWRpY3RSZXNvdXJjZS5hZGRDb3JzUHJlZmxpZ2h0KHtcbiAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXG4gICAgICAgIGFsbG93TWV0aG9kczogWydQT1NUJywgJ09QVElPTlMnXSxcbiAgICAgICAgYWxsb3dIZWFkZXJzOiBbJ0NvbnRlbnQtVHlwZSddLFxuICAgICAgfSk7XG4gICAgICBwcmVkaWN0UmVzb3VyY2UuYWRkTWV0aG9kKCdQT1NUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obW9kZWxMYW1iZGEpKTtcblxuICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgYE1vZGVsRW5kcG9pbnRfJHttb2RlbC5tb2RlbE5hbWV9YCwge1xuICAgICAgICB2YWx1ZTogYCR7YXBpLnVybH0ke21vZGVsLm1vZGVsTmFtZX0vcHJlZGljdGAsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdSZXN0QXBpVXJsJywge1xuICAgICAgdmFsdWU6IGFwaS51cmwsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==