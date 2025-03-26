"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCdkProjectStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
// import * as ecr from 'aws-cdk-lib/aws-ecr'; // Import ECR module
const aws_apigatewayv2_1 = require("aws-cdk-lib/aws-apigatewayv2");
const path = require("path");
class MyCdkProjectStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // // ✅ Create an ECR repository to store the Docker image
        // const repository = new ecr.Repository(this, 'MyRepo', {
        //   repositoryName: 'new-riches-lambda-docker-repo',  // Name for your ECR repository
        // });
        // ✅ Create the Lambda function using a Docker image
        const myLambda = new lambda.DockerImageFunction(this, 'MYLambdaFunction', {
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../spacyLargeModel')),
        });
        // ✅ Create an API Gateway to expose the Lambda function
        // Change to HTTP Gateway???
        // Add route
        // Post /predict
        // const api = new apigateway.LambdaRestApi(this, 'MyGateway', {
        //   handler: myLambda,  // Connect API Gateway to Lambda
        //   proxy: false,        // Forward all requests to Lambda
        // });
        // const predict = api.root.addResource('predict');
        // predict.addMethod('POST')
        aws_apigatewayv2_1.HttpApi.addRoutes({
            path: '/predict',
            method: 'POST',
        });
        // Output the API Gateway URL
        new cdk.CfnOutput(this, 'ApiUrl', {
            value: api.url,
        });
    }
}
exports.MyCdkProjectStack = MyCdkProjectStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2xkZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9sZGZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLGlEQUFpRDtBQUVqRCxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLDZCQUE2QjtBQUc3QixNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsMERBQTBEO1FBQzFELDBEQUEwRDtRQUMxRCxzRkFBc0Y7UUFDdEYsTUFBTTtRQUVOLG9EQUFvRDtRQUNwRCxNQUFNLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDeEUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDLENBQUM7U0FDeEYsQ0FBQyxDQUFDO1FBRUgsd0RBQXdEO1FBQ3hELDRCQUE0QjtRQUM1QixZQUFZO1FBQ1osZ0JBQWdCO1FBQ2hCLGdFQUFnRTtRQUNoRSx5REFBeUQ7UUFDekQsMkRBQTJEO1FBQzNELE1BQU07UUFFTixtREFBbUQ7UUFDbkQsNEJBQTRCO1FBRzVCLDBCQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2hCLElBQUksRUFBRSxVQUFVO1lBQ2hCLE1BQU0sRUFBRSxNQUFNO1NBRWYsQ0FBQyxDQUFBO1FBQ0YsNkJBQTZCO1FBQzdCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2hDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXJDRCw4Q0FxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG4vLyBpbXBvcnQgKiBhcyBlY3IgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcic7IC8vIEltcG9ydCBFQ1IgbW9kdWxlXG5pbXBvcnQgeyBIdHRwQXBpLCBIdHRwTWV0aG9kIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXl2Mic7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBjbGFzcyBNeUNka1Byb2plY3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIC8vIOKchSBDcmVhdGUgYW4gRUNSIHJlcG9zaXRvcnkgdG8gc3RvcmUgdGhlIERvY2tlciBpbWFnZVxuICAgIC8vIGNvbnN0IHJlcG9zaXRvcnkgPSBuZXcgZWNyLlJlcG9zaXRvcnkodGhpcywgJ015UmVwbycsIHtcbiAgICAvLyAgIHJlcG9zaXRvcnlOYW1lOiAnbmV3LXJpY2hlcy1sYW1iZGEtZG9ja2VyLXJlcG8nLCAgLy8gTmFtZSBmb3IgeW91ciBFQ1IgcmVwb3NpdG9yeVxuICAgIC8vIH0pO1xuXG4gICAgLy8g4pyFIENyZWF0ZSB0aGUgTGFtYmRhIGZ1bmN0aW9uIHVzaW5nIGEgRG9ja2VyIGltYWdlXG4gICAgY29uc3QgbXlMYW1iZGEgPSBuZXcgbGFtYmRhLkRvY2tlckltYWdlRnVuY3Rpb24odGhpcywgJ01ZTGFtYmRhRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuRG9ja2VySW1hZ2VDb2RlLmZyb21JbWFnZUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9zcGFjeUxhcmdlTW9kZWwnKSksXG4gICAgfSk7XG5cbiAgICAvLyDinIUgQ3JlYXRlIGFuIEFQSSBHYXRld2F5IHRvIGV4cG9zZSB0aGUgTGFtYmRhIGZ1bmN0aW9uXG4gICAgLy8gQ2hhbmdlIHRvIEhUVFAgR2F0ZXdheT8/P1xuICAgIC8vIEFkZCByb3V0ZVxuICAgIC8vIFBvc3QgL3ByZWRpY3RcbiAgICAvLyBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFSZXN0QXBpKHRoaXMsICdNeUdhdGV3YXknLCB7XG4gICAgLy8gICBoYW5kbGVyOiBteUxhbWJkYSwgIC8vIENvbm5lY3QgQVBJIEdhdGV3YXkgdG8gTGFtYmRhXG4gICAgLy8gICBwcm94eTogZmFsc2UsICAgICAgICAvLyBGb3J3YXJkIGFsbCByZXF1ZXN0cyB0byBMYW1iZGFcbiAgICAvLyB9KTtcblxuICAgIC8vIGNvbnN0IHByZWRpY3QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncHJlZGljdCcpO1xuICAgIC8vIHByZWRpY3QuYWRkTWV0aG9kKCdQT1NUJylcblxuXG4gICAgSHR0cEFwaS5hZGRSb3V0ZXMoe1xuICAgICAgcGF0aDogJy9wcmVkaWN0JyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuXG4gICAgfSlcbiAgICAvLyBPdXRwdXQgdGhlIEFQSSBHYXRld2F5IFVSTFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdBcGlVcmwnLCB7XG4gICAgICB2YWx1ZTogYXBpLnVybCxcbiAgICB9KTtcbiAgfVxufVxuXG4iXX0=