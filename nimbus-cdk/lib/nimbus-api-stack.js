"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NimbusApiStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class NimbusApiStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new apigateway.RestApi(this, 'NimbusRestApi', {
            restApiName: 'NimbuRestApi',
            // potentially add an api key
        });
        api.root.addMethod('GET', new apigateway.LambdaIntegration(new lambda.Function(this, 'NimbusLambda', {
            code: lambda.Code.fromInline('exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify({ message: "Welcome to the Nimbus API!" }) }; }'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_20_X,
        })));
        // potential api key
        new cdk.CfnOutput(this, 'NimbusRestApiId', {
            value: api.restApiId,
            exportName: 'NimbusRestApi' // This is the export name you'll import
        });
        new cdk.CfnOutput(this, 'NimbusRestApiRootResource', {
            value: api.restApiRootResourceId,
            exportName: 'NimbusRestApiRootResource'
        });
        // potential usagePlan
        new cdk.CfnOutput(this, 'url', {
            value: api.url ?? 'Something went wrong',
        });
    }
}
exports.NimbusApiStack = NimbusApiStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWFwaS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1hcGktc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLGlEQUFpRDtBQUNqRCx5REFBeUQ7QUFFekQsTUFBYSxjQUFlLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN4RCxXQUFXLEVBQUUsY0FBYztZQUMzQiw2QkFBNkI7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ25HLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxSUFBcUksQ0FBQztZQUNuSyxPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFTCxvQkFBb0I7UUFFcEIsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN6QyxLQUFLLEVBQUUsR0FBRyxDQUFDLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGVBQWUsQ0FBQyx3Q0FBd0M7U0FDckUsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSwyQkFBMkIsRUFBRTtZQUNuRCxLQUFLLEVBQUUsR0FBRyxDQUFDLHFCQUFxQjtZQUNoQyxVQUFVLEVBQUUsMkJBQTJCO1NBQ3hDLENBQUMsQ0FBQztRQUVILHNCQUFzQjtRQUV0QixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUM3QixLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxzQkFBc0I7U0FDekMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBakNELHdDQWlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG5leHBvcnQgY2xhc3MgTmltYnVzQXBpU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdOaW1idXNSZXN0QXBpJywge1xuICAgICAgcmVzdEFwaU5hbWU6ICdOaW1idVJlc3RBcGknLFxuICAgICAgLy8gcG90ZW50aWFsbHkgYWRkIGFuIGFwaSBrZXlcbiAgICB9KTtcblxuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnTmltYnVzTGFtYmRhJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKGV2ZW50KSA9PiB7IHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMCwgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIldlbGNvbWUgdG8gdGhlIE5pbWJ1cyBBUEkhXCIgfSkgfTsgfScpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsIFxuICAgIH0pKSk7XG5cbiAgICAvLyBwb3RlbnRpYWwgYXBpIGtleVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ05pbWJ1c1Jlc3RBcGlJZCcsIHtcbiAgICAgIHZhbHVlOiBhcGkucmVzdEFwaUlkLFxuICAgICAgZXhwb3J0TmFtZTogJ05pbWJ1c1Jlc3RBcGknIC8vIFRoaXMgaXMgdGhlIGV4cG9ydCBuYW1lIHlvdSdsbCBpbXBvcnRcbiAgICB9KTtcbiAgICBcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnTmltYnVzUmVzdEFwaVJvb3RSZXNvdXJjZScsIHtcbiAgICAgIHZhbHVlOiBhcGkucmVzdEFwaVJvb3RSZXNvdXJjZUlkLFxuICAgICAgZXhwb3J0TmFtZTogJ05pbWJ1c1Jlc3RBcGlSb290UmVzb3VyY2UnXG4gICAgfSk7IFxuXG4gICAgLy8gcG90ZW50aWFsIHVzYWdlUGxhblxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ3VybCcsIHtcbiAgICAgIHZhbHVlOiBhcGkudXJsID8/ICdTb21ldGhpbmcgd2VudCB3cm9uZycsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==