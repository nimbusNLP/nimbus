"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NimbusLambdaStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
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
        const restApiId = cdk.Fn.importValue('NimbusRestApi');
        const rootResourceId = cdk.Fn.importValue('NimbusRestApiRootResource');
        const api = apigateway.RestApi.fromRestApiAttributes(this, 'ImportedRestApi', {
            restApiId: restApiId,
            rootResourceId: rootResourceId,
        });
        const myLambda = new lambda.DockerImageFunction(this, `${modelName}LambdaFunction`, {
            functionName: `${modelName}LambdaFunction`,
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../../nimbus-cli/finished_dir'), {
                platform: aws_ecr_assets_1.Platform.LINUX_AMD64,
            }),
            memorySize: 3008,
            timeout: cdk.Duration.seconds(60),
        });
        myLambda.addPermission(`${modelName}APIGatewayInvoke`, {
            principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${restApiId}/*/*/*`,
        });
        const modelNameRoute = api.root.addResource(modelName);
        const health = modelNameRoute.addResource('health');
        const predict = modelNameRoute.addResource('predict');
        const lambdaIntegration = new apigateway.LambdaIntegration(myLambda);
        predict.addMethod('POST', lambdaIntegration);
        health.addMethod('GET', lambdaIntegration);
        modelNameRoute.addMethod('GET', lambdaIntegration);
        // Replace the existing deployment code with this:
        const deployment = new apigateway.Deployment(this, `${modelName}ApiDeployment`, {
            api: api,
        });
        const prodStage = new apigateway.Stage(this, 'ProdStage', {
            deployment,
            stageName: 'prod'
        });
        const cfnStage = prodStage.node.defaultChild;
        cfnStage.addDependency(deployment.node.defaultChild);
        // Get reference to existing prod stage
        // const prodStage = apigateway.Stage.fromStageAttributes(this, 'ImportedProdStage', {
        //   restApi: api,
        //   stageName: 'prod',
        // });
        // Create a stage update to point the prod stage to our new deployment
        // new apigateway.StageDeployment(this, `${modelName}StageDeployment`, {
        //   stage: prodStage,
        //   deployment: deployment,
        // });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWxhbWJkYS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1sYW1iZGEtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLGlEQUFpRDtBQUNqRCw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBRTNDLCtEQUFzRDtBQUN0RCx5REFBeUQ7QUFNekQsb0NBQW9DO0FBQ3BDLG1FQUFtRTtBQUNuRSxrQkFBa0I7QUFDbEIsbUJBQW1CO0FBQ25CLElBQUk7QUFFSixNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBOEI7UUFDdEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsa0NBQWtDO1FBQ2xDLHNFQUFzRTtRQUN0RSxNQUFNLFNBQVMsR0FBRyxLQUFLLEVBQUUsSUFBSSxJQUFJLFNBQVMsQ0FBQztRQUUzQyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0RCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBRXZFLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQzVFLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLGNBQWMsRUFBRSxjQUFjO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxHQUFHLFNBQVMsZ0JBQWdCLEVBQUU7WUFDbEYsWUFBWSxFQUFFLEdBQUcsU0FBUyxnQkFBZ0I7WUFDMUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwrQkFBK0IsQ0FBQyxFQUNyRDtnQkFDRSxRQUFRLEVBQUUseUJBQVEsQ0FBQyxXQUFXO2FBQy9CLENBQ0Y7WUFDRCxVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxTQUFTLGtCQUFrQixFQUFFO1lBQ3JELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQztZQUMvRCxTQUFTLEVBQUUsdUJBQXVCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxTQUFTLFFBQVE7U0FDbkYsQ0FBQyxDQUFDO1FBR0gsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXRELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNDLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFbkQsa0RBQWtEO1FBQ2xELE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxTQUFTLGVBQWUsRUFBRTtZQUM5RSxHQUFHLEVBQUUsR0FBRztTQUNULENBQUMsQ0FBQztRQUdILE1BQU0sU0FBUyxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3hELFVBQVU7WUFDVixTQUFTLEVBQUUsTUFBTTtTQUNsQixDQUFDLENBQUE7UUFFRixNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQW1DLENBQUM7UUFDcEUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQXdDLENBQUMsQ0FBQTtRQUVoRix1Q0FBdUM7UUFDdkMsc0ZBQXNGO1FBQ3RGLGtCQUFrQjtRQUNsQix1QkFBdUI7UUFDdkIsTUFBTTtRQUVOLHNFQUFzRTtRQUN0RSx3RUFBd0U7UUFDeEUsc0JBQXNCO1FBQ3RCLDRCQUE0QjtRQUM1QixNQUFNO1FBRU4sd0NBQXdDO1FBRXhDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3BDLEtBQUssRUFBRTs7V0FFRixTQUFTO1dBQ1QsU0FBUztXQUNULFNBQVM7T0FDYjtZQUNELDRDQUE0QztTQUM3QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFsRkQsOENBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcblxuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyLWFzc2V0cyc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcblxuaW50ZXJmYWNlIE5pbWJ1c0xhbWJkYVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuLy8gVEhFIEJFTE9XIElTIEFOT1RIRVIgV0FZIFRPIERPIElUXG4vLyBleHBvcnQgaW50ZXJmYWNlIE5pbWJ1c0xhbWJkYVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4vLyAgIG5hbWU6IHN0cmluZztcbi8vICAgYXBpSWQ6IHN0cmluZztcbi8vIH1cblxuZXhwb3J0IGNsYXNzIE5pbWJ1c0xhbWJkYVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBOaW1idXNMYW1iZGFTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBJJ20gdmVyeSB1bnN1cmUgYWJvdXQgdGhpcyBjb2RlXG4gICAgLy8gSG93IGRvIHdlIGdldCB0aGUgbmFtZSB0byBkeW5hbWljYWxseSBjb21lIGludG8gdGhpcyBzdGFjayBjcmVhdGlvblxuICAgIGNvbnN0IG1vZGVsTmFtZSA9IHByb3BzPy5uYW1lIHx8ICdkZWZhdWx0JztcbiAgICBcbiAgICBjb25zdCByZXN0QXBpSWQgPSBjZGsuRm4uaW1wb3J0VmFsdWUoJ05pbWJ1c1Jlc3RBcGknKTtcbiAgICBjb25zdCByb290UmVzb3VyY2VJZCA9IGNkay5Gbi5pbXBvcnRWYWx1ZSgnTmltYnVzUmVzdEFwaVJvb3RSZXNvdXJjZScpO1xuXG4gICAgY29uc3QgYXBpID0gYXBpZ2F0ZXdheS5SZXN0QXBpLmZyb21SZXN0QXBpQXR0cmlidXRlcyh0aGlzLCAnSW1wb3J0ZWRSZXN0QXBpJywge1xuICAgICAgcmVzdEFwaUlkOiByZXN0QXBpSWQsXG4gICAgICByb290UmVzb3VyY2VJZDogcm9vdFJlc291cmNlSWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBteUxhbWJkYSA9IG5ldyBsYW1iZGEuRG9ja2VySW1hZ2VGdW5jdGlvbih0aGlzLCBgJHttb2RlbE5hbWV9TGFtYmRhRnVuY3Rpb25gLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IGAke21vZGVsTmFtZX1MYW1iZGFGdW5jdGlvbmAsXG4gICAgICBjb2RlOiBsYW1iZGEuRG9ja2VySW1hZ2VDb2RlLmZyb21JbWFnZUFzc2V0KFxuICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbmltYnVzLWNsaS9maW5pc2hlZF9kaXInKSxcbiAgICAgICAge1xuICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybS5MSU5VWF9BTUQ2NCxcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIG1lbW9yeVNpemU6IDMwMDgsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgfSk7XG5cbiAgICBteUxhbWJkYS5hZGRQZXJtaXNzaW9uKGAke21vZGVsTmFtZX1BUElHYXRld2F5SW52b2tlYCwge1xuICAgICAgcHJpbmNpcGFsOiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2FwaWdhdGV3YXkuYW1hem9uYXdzLmNvbScpLFxuICAgICAgc291cmNlQXJuOiBgYXJuOmF3czpleGVjdXRlLWFwaToke3RoaXMucmVnaW9ufToke3RoaXMuYWNjb3VudH06JHtyZXN0QXBpSWR9LyovKi8qYCxcbiAgICB9KTtcblxuICAgIFxuICAgIGNvbnN0IG1vZGVsTmFtZVJvdXRlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UobW9kZWxOYW1lKTtcbiAgICBjb25zdCBoZWFsdGggPSBtb2RlbE5hbWVSb3V0ZS5hZGRSZXNvdXJjZSgnaGVhbHRoJyk7XG4gICAgY29uc3QgcHJlZGljdCA9IG1vZGVsTmFtZVJvdXRlLmFkZFJlc291cmNlKCdwcmVkaWN0Jyk7XG5cbiAgICBjb25zdCBsYW1iZGFJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKG15TGFtYmRhKTtcblxuICAgIHByZWRpY3QuYWRkTWV0aG9kKCdQT1NUJywgbGFtYmRhSW50ZWdyYXRpb24pO1xuICAgIGhlYWx0aC5hZGRNZXRob2QoJ0dFVCcsIGxhbWJkYUludGVncmF0aW9uKTtcbiAgICBtb2RlbE5hbWVSb3V0ZS5hZGRNZXRob2QoJ0dFVCcsIGxhbWJkYUludGVncmF0aW9uKTtcblxuICAgIC8vIFJlcGxhY2UgdGhlIGV4aXN0aW5nIGRlcGxveW1lbnQgY29kZSB3aXRoIHRoaXM6XG4gICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQodGhpcywgYCR7bW9kZWxOYW1lfUFwaURlcGxveW1lbnRgLCB7XG4gICAgICBhcGk6IGFwaSxcbiAgICB9KTtcblxuXG4gICAgY29uc3QgcHJvZFN0YWdlID0gbmV3IGFwaWdhdGV3YXkuU3RhZ2UodGhpcywgJ1Byb2RTdGFnZScsIHtcbiAgICAgIGRlcGxveW1lbnQsXG4gICAgICBzdGFnZU5hbWU6ICdwcm9kJ1xuICAgIH0pXG5cbiAgICBjb25zdCBjZm5TdGFnZSA9IHByb2RTdGFnZS5ub2RlLmRlZmF1bHRDaGlsZCBhcyBhcGlnYXRld2F5LkNmblN0YWdlO1xuICAgIGNmblN0YWdlLmFkZERlcGVuZGVuY3koZGVwbG95bWVudC5ub2RlLmRlZmF1bHRDaGlsZCBhcyBhcGlnYXRld2F5LkNmbkRlcGxveW1lbnQpXG5cbiAgICAvLyBHZXQgcmVmZXJlbmNlIHRvIGV4aXN0aW5nIHByb2Qgc3RhZ2VcbiAgICAvLyBjb25zdCBwcm9kU3RhZ2UgPSBhcGlnYXRld2F5LlN0YWdlLmZyb21TdGFnZUF0dHJpYnV0ZXModGhpcywgJ0ltcG9ydGVkUHJvZFN0YWdlJywge1xuICAgIC8vICAgcmVzdEFwaTogYXBpLFxuICAgIC8vICAgc3RhZ2VOYW1lOiAncHJvZCcsXG4gICAgLy8gfSk7XG5cbiAgICAvLyBDcmVhdGUgYSBzdGFnZSB1cGRhdGUgdG8gcG9pbnQgdGhlIHByb2Qgc3RhZ2UgdG8gb3VyIG5ldyBkZXBsb3ltZW50XG4gICAgLy8gbmV3IGFwaWdhdGV3YXkuU3RhZ2VEZXBsb3ltZW50KHRoaXMsIGAke21vZGVsTmFtZX1TdGFnZURlcGxveW1lbnRgLCB7XG4gICAgLy8gICBzdGFnZTogcHJvZFN0YWdlLFxuICAgIC8vICAgZGVwbG95bWVudDogZGVwbG95bWVudCxcbiAgICAvLyB9KTtcblxuICAgIC8vIE1heWJlIHdlIGRvbid0IHJldHVybiBhbnl0aGluZyBoZXJlLiBcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdSZXN0QXBpVXJsJywge1xuICAgICAgdmFsdWU6IGBcbiAgICAgICAgVGhlIGZvbGxvd2luZyBwYXRocyBjYW4gYmUgY2FsbGVkIHVzaW5nIHRoZSBiYXNlIFVSTDpcbiAgICAgICAgLyR7bW9kZWxOYW1lfVxuICAgICAgICAvJHttb2RlbE5hbWV9L3ByZWRpY3RcbiAgICAgICAgLyR7bW9kZWxOYW1lfS9oZWFsdGhcbiAgICAgIGBcbiAgICAgIC8vIHZhbHVlOiBhcGkudXJsID8/ICdTb21ldGhpbmcgd2VudCB3cm9uZycsXG4gICAgfSk7XG4gIH1cbn0iXX0=