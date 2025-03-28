"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NimbusLambdaStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const path = require("path");
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
const apigateway = require("aws-cdk-lib/aws-apigateway");
// THE BELOW IS ANOTHER WAY TO DO IT
// export interface NimbusLambdaStackProps extends cdk.StackProps {
//   name: string;
//   apiId: string;
// }
class NimbusLambdaStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // I'm very unsure about this code
        // How do we get the name to dynamically come into this stack creation
        const modelName = props?.name || 'default';
        const myLambda = new lambda.DockerImageFunction(this, `${modelName}LambdaFunction`, {
            functionName: `${modelName}LambdaFunction`,
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../../nimbus-cli/finished_dir'), {
                platform: aws_ecr_assets_1.Platform.LINUX_AMD64,
            }),
            memorySize: 3008,
            timeout: cdk.Duration.seconds(60),
        });
        const restApiId = cdk.Fn.importValue('NimbusRestApi');
        const rootResourceId = cdk.Fn.importValue('NimbusRestApiRootResource');
        const api = apigateway.RestApi.fromRestApiAttributes(this, 'ImportedRestApi', {
            restApiId: restApiId,
            rootResourceId: rootResourceId,
        });
        const modelNameRoute = api.root.addResource(modelName);
        const health = modelNameRoute.addResource('health');
        const predict = modelNameRoute.addResource('predict');
        const lambdaIntegration = new apigateway.LambdaIntegration(myLambda);
        predict.addMethod('POST', lambdaIntegration);
        health.addMethod('GET', lambdaIntegration);
        modelNameRoute.addMethod('GET', lambdaIntegration);
        // Maybe we don't return anything here. 
        new cdk.CfnOutput(this, 'RestApiUrl', {
            value: `
        The following paths can be called using the base URL:
        /${modelName}
        /${modelName}/predict
        /${modelName}/health
      `
            // value: api.url ?? 'Something went wrong',
        });
    }
}
exports.NimbusLambdaStack = NimbusLambdaStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWxhbWJkYS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1sYW1iZGEtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLGlEQUFpRDtBQUNqRCw2QkFBNkI7QUFJN0IsK0RBQXNEO0FBQ3RELHlEQUF5RDtBQU16RCxvQ0FBb0M7QUFDcEMsbUVBQW1FO0FBQ25FLGtCQUFrQjtBQUNsQixtQkFBbUI7QUFDbkIsSUFBSTtBQUVKLE1BQWEsaUJBQWtCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE4QjtRQUN0RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixrQ0FBa0M7UUFDbEMsc0VBQXNFO1FBQ3RFLE1BQU0sU0FBUyxHQUFHLEtBQUssRUFBRSxJQUFJLElBQUksU0FBUyxDQUFDO1FBRTNDLE1BQU0sUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxHQUFHLFNBQVMsZ0JBQWdCLEVBQUU7WUFDbEYsWUFBWSxFQUFFLEdBQUcsU0FBUyxnQkFBZ0I7WUFDMUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwrQkFBK0IsQ0FBQyxFQUNyRDtnQkFDRSxRQUFRLEVBQUUseUJBQVEsQ0FBQyxXQUFXO2FBQy9CLENBQ0Y7WUFDRCxVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFFdkUsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDNUUsU0FBUyxFQUFFLFNBQVM7WUFDcEIsY0FBYyxFQUFFLGNBQWM7U0FDL0IsQ0FBQyxDQUFDO1FBSUgsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXRELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNDLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFbkQsd0NBQXdDO1FBRXhDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3BDLEtBQUssRUFBRTs7V0FFRixTQUFTO1dBQ1QsU0FBUztXQUNULFNBQVM7T0FDYjtZQUNELDRDQUE0QztTQUM3QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFwREQsOENBb0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuXG5cbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjci1hc3NldHMnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5cbmludGVyZmFjZSBOaW1idXNMYW1iZGFTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8vIFRIRSBCRUxPVyBJUyBBTk9USEVSIFdBWSBUTyBETyBJVFxuLy8gZXhwb3J0IGludGVyZmFjZSBOaW1idXNMYW1iZGFTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuLy8gICBuYW1lOiBzdHJpbmc7XG4vLyAgIGFwaUlkOiBzdHJpbmc7XG4vLyB9XG5cbmV4cG9ydCBjbGFzcyBOaW1idXNMYW1iZGFTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogTmltYnVzTGFtYmRhU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gSSdtIHZlcnkgdW5zdXJlIGFib3V0IHRoaXMgY29kZVxuICAgIC8vIEhvdyBkbyB3ZSBnZXQgdGhlIG5hbWUgdG8gZHluYW1pY2FsbHkgY29tZSBpbnRvIHRoaXMgc3RhY2sgY3JlYXRpb25cbiAgICBjb25zdCBtb2RlbE5hbWUgPSBwcm9wcz8ubmFtZSB8fCAnZGVmYXVsdCc7XG5cbiAgICBjb25zdCBteUxhbWJkYSA9IG5ldyBsYW1iZGEuRG9ja2VySW1hZ2VGdW5jdGlvbih0aGlzLCBgJHttb2RlbE5hbWV9TGFtYmRhRnVuY3Rpb25gLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IGAke21vZGVsTmFtZX1MYW1iZGFGdW5jdGlvbmAsXG4gICAgICBjb2RlOiBsYW1iZGEuRG9ja2VySW1hZ2VDb2RlLmZyb21JbWFnZUFzc2V0KFxuICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbmltYnVzLWNsaS9maW5pc2hlZF9kaXInKSxcbiAgICAgICAge1xuICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybS5MSU5VWF9BTUQ2NCxcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIG1lbW9yeVNpemU6IDMwMDgsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN0QXBpSWQgPSBjZGsuRm4uaW1wb3J0VmFsdWUoJ05pbWJ1c1Jlc3RBcGknKTtcbiAgICBjb25zdCByb290UmVzb3VyY2VJZCA9IGNkay5Gbi5pbXBvcnRWYWx1ZSgnTmltYnVzUmVzdEFwaVJvb3RSZXNvdXJjZScpO1xuXG4gICAgY29uc3QgYXBpID0gYXBpZ2F0ZXdheS5SZXN0QXBpLmZyb21SZXN0QXBpQXR0cmlidXRlcyh0aGlzLCAnSW1wb3J0ZWRSZXN0QXBpJywge1xuICAgICAgcmVzdEFwaUlkOiByZXN0QXBpSWQsXG4gICAgICByb290UmVzb3VyY2VJZDogcm9vdFJlc291cmNlSWQsXG4gICAgfSk7XG5cblxuXG4gICAgY29uc3QgbW9kZWxOYW1lUm91dGUgPSBhcGkucm9vdC5hZGRSZXNvdXJjZShtb2RlbE5hbWUpO1xuICAgIGNvbnN0IGhlYWx0aCA9IG1vZGVsTmFtZVJvdXRlLmFkZFJlc291cmNlKCdoZWFsdGgnKTtcbiAgICBjb25zdCBwcmVkaWN0ID0gbW9kZWxOYW1lUm91dGUuYWRkUmVzb3VyY2UoJ3ByZWRpY3QnKTtcblxuICAgIGNvbnN0IGxhbWJkYUludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obXlMYW1iZGEpO1xuXG4gICAgcHJlZGljdC5hZGRNZXRob2QoJ1BPU1QnLCBsYW1iZGFJbnRlZ3JhdGlvbik7XG4gICAgaGVhbHRoLmFkZE1ldGhvZCgnR0VUJywgbGFtYmRhSW50ZWdyYXRpb24pO1xuICAgIG1vZGVsTmFtZVJvdXRlLmFkZE1ldGhvZCgnR0VUJywgbGFtYmRhSW50ZWdyYXRpb24pO1xuXG4gICAgLy8gTWF5YmUgd2UgZG9uJ3QgcmV0dXJuIGFueXRoaW5nIGhlcmUuIFxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1Jlc3RBcGlVcmwnLCB7XG4gICAgICB2YWx1ZTogYFxuICAgICAgICBUaGUgZm9sbG93aW5nIHBhdGhzIGNhbiBiZSBjYWxsZWQgdXNpbmcgdGhlIGJhc2UgVVJMOlxuICAgICAgICAvJHttb2RlbE5hbWV9XG4gICAgICAgIC8ke21vZGVsTmFtZX0vcHJlZGljdFxuICAgICAgICAvJHttb2RlbE5hbWV9L2hlYWx0aFxuICAgICAgYFxuICAgICAgLy8gdmFsdWU6IGFwaS51cmwgPz8gJ1NvbWV0aGluZyB3ZW50IHdyb25nJyxcbiAgICB9KTtcbiAgfVxufSJdfQ==