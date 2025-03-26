"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCdkProjectStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const path = require("path");
// Import alpha modules for HTTP API v2
const aws_apigatewayv2_alpha_1 = require("@aws-cdk/aws-apigatewayv2-alpha");
const aws_apigatewayv2_integrations_alpha_1 = require("@aws-cdk/aws-apigatewayv2-integrations-alpha");
// Import the Platform enum
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
class MyCdkProjectStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Force the Docker build to x86_64 (linux/amd64)
        const myLambda = new lambda.DockerImageFunction(this, 'myLambdaFunction', {
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../spacyLargeModel'), {
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
exports.MyCdkProjectStack = MyCdkProjectStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktY2RrLXByb2plY3Qtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJteS1jZGstcHJvamVjdC1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMsaURBQWlEO0FBQ2pELDZCQUE2QjtBQUU3Qix1Q0FBdUM7QUFDdkMsNEVBR3lDO0FBQ3pDLHNHQUVzRDtBQUV0RCwyQkFBMkI7QUFDM0IsK0RBQXNEO0FBRXRELE1BQWEsaUJBQWtCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixpREFBaUQ7UUFDakQsTUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3hFLElBQUksRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsRUFDMUM7Z0JBQ0UsUUFBUSxFQUFFLHlCQUFRLENBQUMsV0FBVzthQUMvQixDQUNGO1lBQ0QsVUFBVSxFQUFFLElBQUk7WUFDaEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztTQUNsQyxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLGdDQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ2xELE9BQU8sRUFBRSxnQkFBZ0I7U0FDMUIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLDJEQUFxQixDQUNqRCxtQkFBbUIsRUFDbkIsUUFBUSxDQUNULENBQUM7UUFFRixPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2hCLElBQUksRUFBRSxVQUFVO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLG1DQUFVLENBQUMsSUFBSSxDQUFDO1lBQzFCLFdBQVcsRUFBRSxpQkFBaUI7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDcEMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksc0JBQXNCO1NBQzdDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQW5DRCw4Q0FtQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG4vLyBJbXBvcnQgYWxwaGEgbW9kdWxlcyBmb3IgSFRUUCBBUEkgdjJcbmltcG9ydCB7XG4gIEh0dHBBcGksXG4gIEh0dHBNZXRob2QsXG59IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5djItYWxwaGEnO1xuaW1wb3J0IHtcbiAgSHR0cExhbWJkYUludGVncmF0aW9uLFxufSBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucy1hbHBoYSc7XG5cbi8vIEltcG9ydCB0aGUgUGxhdGZvcm0gZW51bVxuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyLWFzc2V0cyc7XG5cbmV4cG9ydCBjbGFzcyBNeUNka1Byb2plY3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIEZvcmNlIHRoZSBEb2NrZXIgYnVpbGQgdG8geDg2XzY0IChsaW51eC9hbWQ2NClcbiAgICBjb25zdCBteUxhbWJkYSA9IG5ldyBsYW1iZGEuRG9ja2VySW1hZ2VGdW5jdGlvbih0aGlzLCAnbXlMYW1iZGFGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Eb2NrZXJJbWFnZUNvZGUuZnJvbUltYWdlQXNzZXQoXG4gICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9zcGFjeUxhcmdlTW9kZWwnKSxcbiAgICAgICAge1xuICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybS5MSU5VWF9BTUQ2NCxcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIG1lbW9yeVNpemU6IDMwMDgsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBodHRwQXBpID0gbmV3IEh0dHBBcGkodGhpcywgJ1ByZWRpY3RIdHRwQXBpJywge1xuICAgICAgYXBpTmFtZTogJ1ByZWRpY3RIdHRwQXBpJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGxhbWJkYUludGVncmF0aW9uID0gbmV3IEh0dHBMYW1iZGFJbnRlZ3JhdGlvbihcbiAgICAgICdMYW1iZGFJbnRlZ3JhdGlvbicsXG4gICAgICBteUxhbWJkYVxuICAgICk7XG5cbiAgICBodHRwQXBpLmFkZFJvdXRlcyh7XG4gICAgICBwYXRoOiAnL3ByZWRpY3QnLFxuICAgICAgbWV0aG9kczogW0h0dHBNZXRob2QuUE9TVF0sXG4gICAgICBpbnRlZ3JhdGlvbjogbGFtYmRhSW50ZWdyYXRpb24sXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnSHR0cEFwaVVybCcsIHtcbiAgICAgIHZhbHVlOiBodHRwQXBpLnVybCA/PyAnU29tZXRoaW5nIHdlbnQgd3JvbmcnLFxuICAgIH0pO1xuICB9XG59XG4iXX0=