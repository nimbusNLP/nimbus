"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NimbusLambdaStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const path = require("path");
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class NimbusLambdaStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // I'm very unsure about this code
        // How do we get the name to dynamically come into this stack creation
        const modelName = props.name;
        const myLambda = new lambda.DockerImageFunction(this, `${modelName}LambdaFunction`, {
            functionName: `${modelName}LambdaFunction`,
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../../nimbus-cli/finished_dir'), {
                platform: aws_ecr_assets_1.Platform.LINUX_AMD64,
            }),
            memorySize: 3008,
            timeout: cdk.Duration.seconds(60),
        });
        const restApiId = cdk.Fn.importValue('NimbusRestApi');
        // 2nd arg may need a separate name, like 'ImportedRestApi'
        const api = apigateway.RestApi.fromRestApiId(this, 'NimbusRestApi', restApiId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWxhbWJkYS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1sYW1iZGEtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLGlEQUFpRDtBQUNqRCw2QkFBNkI7QUFJN0IsK0RBQXNEO0FBQ3RELHlEQUF5RDtBQU16RCxNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBOEI7UUFDdEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsa0NBQWtDO1FBQ2xDLHNFQUFzRTtRQUN0RSxNQUFNLFNBQVMsR0FBRyxLQUFNLENBQUMsSUFBSSxDQUFDO1FBRTlCLE1BQU0sUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxHQUFHLFNBQVMsZ0JBQWdCLEVBQUU7WUFDbEYsWUFBWSxFQUFFLEdBQUcsU0FBUyxnQkFBZ0I7WUFDMUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwrQkFBK0IsQ0FBQyxFQUNyRDtnQkFDRSxRQUFRLEVBQUUseUJBQVEsQ0FBQyxXQUFXO2FBQy9CLENBQ0Y7WUFDRCxVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JELDJEQUEyRDtRQUM1RCxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRy9FLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV0RCxNQUFNLGlCQUFpQixHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXJFLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUMzQyxjQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRW5ELHdDQUF3QztRQUV4QyxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNwQyxLQUFLLEVBQUU7O1dBRUYsU0FBUztXQUNULFNBQVM7V0FDVCxTQUFTO09BQ2I7WUFDRCw0Q0FBNEM7U0FDN0MsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBL0NELDhDQStDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cblxuXG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3ItYXNzZXRzJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG5pbnRlcmZhY2UgTmltYnVzTGFtYmRhU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgbmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTmltYnVzTGFtYmRhU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IE5pbWJ1c0xhbWJkYVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIEknbSB2ZXJ5IHVuc3VyZSBhYm91dCB0aGlzIGNvZGVcbiAgICAvLyBIb3cgZG8gd2UgZ2V0IHRoZSBuYW1lIHRvIGR5bmFtaWNhbGx5IGNvbWUgaW50byB0aGlzIHN0YWNrIGNyZWF0aW9uXG4gICAgY29uc3QgbW9kZWxOYW1lID0gcHJvcHMhLm5hbWU7XG5cbiAgICBjb25zdCBteUxhbWJkYSA9IG5ldyBsYW1iZGEuRG9ja2VySW1hZ2VGdW5jdGlvbih0aGlzLCBgJHttb2RlbE5hbWV9TGFtYmRhRnVuY3Rpb25gLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IGAke21vZGVsTmFtZX1MYW1iZGFGdW5jdGlvbmAsXG4gICAgICBjb2RlOiBsYW1iZGEuRG9ja2VySW1hZ2VDb2RlLmZyb21JbWFnZUFzc2V0KFxuICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbmltYnVzLWNsaS9maW5pc2hlZF9kaXInKSxcbiAgICAgICAge1xuICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybS5MSU5VWF9BTUQ2NCxcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIG1lbW9yeVNpemU6IDMwMDgsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN0QXBpSWQgPSBjZGsuRm4uaW1wb3J0VmFsdWUoJ05pbWJ1c1Jlc3RBcGknKTtcbiAgICAgLy8gMm5kIGFyZyBtYXkgbmVlZCBhIHNlcGFyYXRlIG5hbWUsIGxpa2UgJ0ltcG9ydGVkUmVzdEFwaSdcbiAgICBjb25zdCBhcGkgPSBhcGlnYXRld2F5LlJlc3RBcGkuZnJvbVJlc3RBcGlJZCh0aGlzLCAnTmltYnVzUmVzdEFwaScsIHJlc3RBcGlJZCk7XG5cblxuICAgIGNvbnN0IG1vZGVsTmFtZVJvdXRlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UobW9kZWxOYW1lKTtcbiAgICBjb25zdCBoZWFsdGggPSBtb2RlbE5hbWVSb3V0ZS5hZGRSZXNvdXJjZSgnaGVhbHRoJyk7XG4gICAgY29uc3QgcHJlZGljdCA9IG1vZGVsTmFtZVJvdXRlLmFkZFJlc291cmNlKCdwcmVkaWN0Jyk7XG5cbiAgICBjb25zdCBsYW1iZGFJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKG15TGFtYmRhKTtcblxuICAgIHByZWRpY3QuYWRkTWV0aG9kKCdQT1NUJywgbGFtYmRhSW50ZWdyYXRpb24pO1xuICAgIGhlYWx0aC5hZGRNZXRob2QoJ0dFVCcsIGxhbWJkYUludGVncmF0aW9uKTtcbiAgICBtb2RlbE5hbWVSb3V0ZS5hZGRNZXRob2QoJ0dFVCcsIGxhbWJkYUludGVncmF0aW9uKTtcblxuICAgIC8vIE1heWJlIHdlIGRvbid0IHJldHVybiBhbnl0aGluZyBoZXJlLiBcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdSZXN0QXBpVXJsJywge1xuICAgICAgdmFsdWU6IGBcbiAgICAgICAgVGhlIGZvbGxvd2luZyBwYXRocyBjYW4gYmUgY2FsbGVkIHVzaW5nIHRoZSBiYXNlIFVSTDpcbiAgICAgICAgLyR7bW9kZWxOYW1lfVxuICAgICAgICAvJHttb2RlbE5hbWV9L3ByZWRpY3RcbiAgICAgICAgLyR7bW9kZWxOYW1lfS9oZWFsdGhcbiAgICAgIGBcbiAgICAgIC8vIHZhbHVlOiBhcGkudXJsID8/ICdTb21ldGhpbmcgd2VudCB3cm9uZycsXG4gICAgfSk7XG4gIH1cbn0iXX0=