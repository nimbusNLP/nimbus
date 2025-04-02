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
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline('exports.handler = async () => { return { statusCode: 200, body: "No model deployed yet." }; }'),
        });
        api.root.addMethod('GET', new apigateway.LambdaIntegration(defaultLambda));
        const pathToFinishedDir = path.join(__dirname, '../../../', 'Nimbus_Model_Storage', 'finished_dir');
        const modelsConfigPath = path.join(pathToFinishedDir, 'models.json');
        let models = [];
        if (fs.existsSync(modelsConfigPath)) {
            models = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));
        }
        models.forEach((model) => {
            const modelLambda = new lambda.DockerImageFunction(this, `Lambda_${model.modelName}`, {
                code: lambda.DockerImageCode.fromImageAsset(path.join(pathToFinishedDir, model.modelName), {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1jZGstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLGlEQUFpRDtBQUNqRCx5REFBeUQ7QUFFekQseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QiwrREFBc0Q7QUFRdEQsTUFBYSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFHeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN6RCxXQUFXLEVBQUUsZ0JBQWdCO1lBQzdCLGFBQWEsRUFBRTtnQkFDYixTQUFTLEVBQUUsTUFBTTthQUNsQjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQy9ELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUMxQiwrRkFBK0YsQ0FDaEc7U0FDRixDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUUzRSxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxzQkFBc0IsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUVuRyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDckUsSUFBSSxNQUFNLEdBQWtCLEVBQUUsQ0FBQztRQUMvQixJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBR0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3ZCLE1BQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxVQUFVLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFDcEYsSUFBSSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFDN0M7b0JBQ0UsUUFBUSxFQUFFLHlCQUFRLENBQUMsV0FBVztpQkFDL0IsQ0FDRjtnQkFDRCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQzthQUNsQyxDQUFDLENBQUM7WUFHSCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUQsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3RCxlQUFlLENBQUMsZ0JBQWdCLENBQUM7Z0JBQy9CLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ3pDLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7Z0JBQ2pDLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQzthQUMvQixDQUFDLENBQUM7WUFDSCxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBSWpGLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFDMUQsS0FBSyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsU0FBUyxVQUFVO2FBQzlDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBR0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDcEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1NBQ2YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBaEVELDBDQWdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjci1hc3NldHMnO1xuXG5pbnRlcmZhY2UgTW9kZWxDb25maWcge1xuICBtb2RlbE5hbWU6IHN0cmluZztcbiAgbW9kZWxUeXBlOiBzdHJpbmc7XG4gIG1vZGVsUGF0aE9yTmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQXBpR2F0ZXdheVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdQcmVkaWN0UmVzdEFwaScsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiAnUHJlZGljdFJlc3RBcGknLFxuICAgICAgZGVwbG95T3B0aW9uczoge1xuICAgICAgICBzdGFnZU5hbWU6ICdwcm9kJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWZhdWx0TGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRGVmYXVsdExhbWJkYScsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZShcbiAgICAgICAgJ2V4cG9ydHMuaGFuZGxlciA9IGFzeW5jICgpID0+IHsgcmV0dXJuIHsgc3RhdHVzQ29kZTogMjAwLCBib2R5OiBcIk5vIG1vZGVsIGRlcGxveWVkIHlldC5cIiB9OyB9J1xuICAgICAgKSxcbiAgICB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGRlZmF1bHRMYW1iZGEpKTtcbiBcbiAgICBjb25zdCBwYXRoVG9GaW5pc2hlZERpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi8nLCAnTmltYnVzX01vZGVsX1N0b3JhZ2UnLCAnZmluaXNoZWRfZGlyJylcblxuICAgIGNvbnN0IG1vZGVsc0NvbmZpZ1BhdGggPSBwYXRoLmpvaW4ocGF0aFRvRmluaXNoZWREaXIsICdtb2RlbHMuanNvbicpOyAgICBcbiAgICBsZXQgbW9kZWxzOiBNb2RlbENvbmZpZ1tdID0gW107XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMobW9kZWxzQ29uZmlnUGF0aCkpIHtcbiAgICAgIG1vZGVscyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKG1vZGVsc0NvbmZpZ1BhdGgsICd1dGY4JykpO1xuICAgIH1cblxuICAgXG4gICAgbW9kZWxzLmZvckVhY2goKG1vZGVsKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbExhbWJkYSA9IG5ldyBsYW1iZGEuRG9ja2VySW1hZ2VGdW5jdGlvbih0aGlzLCBgTGFtYmRhXyR7bW9kZWwubW9kZWxOYW1lfWAsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkRvY2tlckltYWdlQ29kZS5mcm9tSW1hZ2VBc3NldChcbiAgICAgICAgICBwYXRoLmpvaW4ocGF0aFRvRmluaXNoZWREaXIsIG1vZGVsLm1vZGVsTmFtZSksXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLkxJTlVYX0FNRDY0LFxuICAgICAgICAgIH1cbiAgICAgICAgKSxcbiAgICAgICAgbWVtb3J5U2l6ZTogMzAwOCxcbiAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgfSk7XG5cbiBcbiAgICAgIGNvbnN0IG1vZGVsUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZShtb2RlbC5tb2RlbE5hbWUpO1xuICAgICAgY29uc3QgcHJlZGljdFJlc291cmNlID0gbW9kZWxSZXNvdXJjZS5hZGRSZXNvdXJjZSgncHJlZGljdCcpO1xuICAgICAgcHJlZGljdFJlc291cmNlLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcbiAgICAgICAgYWxsb3dNZXRob2RzOiBbJ1BPU1QnLCAnT1BUSU9OUyddLFxuICAgICAgICBhbGxvd0hlYWRlcnM6IFsnQ29udGVudC1UeXBlJ10sXG4gICAgICB9KTtcbiAgICAgIHByZWRpY3RSZXNvdXJjZS5hZGRNZXRob2QoJ1BPU1QnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihtb2RlbExhbWJkYSkpO1xuXG4gICAgXG5cbiAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIGBNb2RlbEVuZHBvaW50XyR7bW9kZWwubW9kZWxOYW1lfWAsIHtcbiAgICAgICAgdmFsdWU6IGAke2FwaS51cmx9JHttb2RlbC5tb2RlbE5hbWV9L3ByZWRpY3RgLFxuICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdSZXN0QXBpVXJsJywge1xuICAgICAgdmFsdWU6IGFwaS51cmwsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==