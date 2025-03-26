"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NimbusCdkStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const path = require("path");
// Import alpha modules for HTTP API v2
const aws_apigatewayv2_alpha_1 = require("@aws-cdk/aws-apigatewayv2-alpha");
const aws_apigatewayv2_integrations_alpha_1 = require("@aws-cdk/aws-apigatewayv2-integrations-alpha");
// Import the Platform enum
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
class NimbusCdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Force the Docker build to x86_64 (linux/amd64)
        const myLambda = new lambda.DockerImageFunction(this, 'myLambdaFunction', {
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../../nimbus-cli/finished_dir'), {
                platform: aws_ecr_assets_1.Platform.LINUX_AMD64,
            }),
            memorySize: 3008,
            timeout: cdk.Duration.seconds(60),
        });
        const httpApi = new aws_apigatewayv2_alpha_1.HttpApi(this, 'PredictHttpApi', {
            apiName: 'PredictHttpApi',
        });
        const lambdaIntegration = new aws_apigatewayv2_integrations_alpha_1.HttpLambdaIntegration('LambdaIntegration', myLambda);
        httpApi.addRoutes({
            path: '/predict',
            methods: [aws_apigatewayv2_alpha_1.HttpMethod.POST],
            integration: lambdaIntegration,
        });
        new cdk.CfnOutput(this, 'HttpApiUrl', {
            value: httpApi.url ?? 'Something went wrong',
        });
    }
}
exports.NimbusCdkStack = NimbusCdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1jZGstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLGlEQUFpRDtBQUNqRCw2QkFBNkI7QUFFN0IsdUNBQXVDO0FBQ3ZDLDRFQUd5QztBQUN6QyxzR0FFc0Q7QUFFdEQsMkJBQTJCO0FBQzNCLCtEQUFzRDtBQUV0RCxNQUFhLGNBQWUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMzQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLGlEQUFpRDtRQUNqRCxNQUFNLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDeEUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwrQkFBK0IsQ0FBQyxFQUNyRDtnQkFDRSxRQUFRLEVBQUUseUJBQVEsQ0FBQyxXQUFXO2FBQy9CLENBQ0Y7WUFDRCxVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLElBQUksZ0NBQU8sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDbEQsT0FBTyxFQUFFLGdCQUFnQjtTQUMxQixDQUFDLENBQUM7UUFFSCxNQUFNLGlCQUFpQixHQUFHLElBQUksMkRBQXFCLENBQ2pELG1CQUFtQixFQUNuQixRQUFRLENBQ1QsQ0FBQztRQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDaEIsSUFBSSxFQUFFLFVBQVU7WUFDaEIsT0FBTyxFQUFFLENBQUMsbUNBQVUsQ0FBQyxJQUFJLENBQUM7WUFDMUIsV0FBVyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNwQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxzQkFBc0I7U0FDN0MsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBbkNELHdDQW1DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIEltcG9ydCBhbHBoYSBtb2R1bGVzIGZvciBIVFRQIEFQSSB2MlxuaW1wb3J0IHtcbiAgSHR0cEFwaSxcbiAgSHR0cE1ldGhvZCxcbn0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXl2Mi1hbHBoYSc7XG5pbXBvcnQge1xuICBIdHRwTGFtYmRhSW50ZWdyYXRpb24sXG59IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5djItaW50ZWdyYXRpb25zLWFscGhhJztcblxuLy8gSW1wb3J0IHRoZSBQbGF0Zm9ybSBlbnVtXG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3ItYXNzZXRzJztcblxuZXhwb3J0IGNsYXNzIE5pbWJ1c0Nka1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gRm9yY2UgdGhlIERvY2tlciBidWlsZCB0byB4ODZfNjQgKGxpbnV4L2FtZDY0KVxuICAgIGNvbnN0IG15TGFtYmRhID0gbmV3IGxhbWJkYS5Eb2NrZXJJbWFnZUZ1bmN0aW9uKHRoaXMsICdteUxhbWJkYUZ1bmN0aW9uJywge1xuICAgICAgY29kZTogbGFtYmRhLkRvY2tlckltYWdlQ29kZS5mcm9tSW1hZ2VBc3NldChcbiAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL25pbWJ1cy1jbGkvZmluaXNoZWRfZGlyJyksXG4gICAgICAgIHtcbiAgICAgICAgICBwbGF0Zm9ybTogUGxhdGZvcm0uTElOVVhfQU1ENjQsXG4gICAgICAgIH1cbiAgICAgICksXG4gICAgICBtZW1vcnlTaXplOiAzMDA4LFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaHR0cEFwaSA9IG5ldyBIdHRwQXBpKHRoaXMsICdQcmVkaWN0SHR0cEFwaScsIHtcbiAgICAgIGFwaU5hbWU6ICdQcmVkaWN0SHR0cEFwaScsXG4gICAgfSk7XG5cbiAgICBjb25zdCBsYW1iZGFJbnRlZ3JhdGlvbiA9IG5ldyBIdHRwTGFtYmRhSW50ZWdyYXRpb24oXG4gICAgICAnTGFtYmRhSW50ZWdyYXRpb24nLFxuICAgICAgbXlMYW1iZGFcbiAgICApO1xuXG4gICAgaHR0cEFwaS5hZGRSb3V0ZXMoe1xuICAgICAgcGF0aDogJy9wcmVkaWN0JyxcbiAgICAgIG1ldGhvZHM6IFtIdHRwTWV0aG9kLlBPU1RdLFxuICAgICAgaW50ZWdyYXRpb246IGxhbWJkYUludGVncmF0aW9uLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0h0dHBBcGlVcmwnLCB7XG4gICAgICB2YWx1ZTogaHR0cEFwaS51cmwgPz8gJ1NvbWV0aGluZyB3ZW50IHdyb25nJyxcbiAgICB9KTtcbiAgfVxufVxuIl19