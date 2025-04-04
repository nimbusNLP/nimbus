"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const nimbus_cdk_stack_1 = require("../lib/nimbus-cdk-stack");
const path = require("path");
(0, globals_1.describe)('ApiGatewayStack', () => {
    (0, globals_1.test)('creates REST API with default configuration', () => {
        // ARRANGE
        const app = new cdk.App({
            context: {
                'finishedDirPath': path.join(__dirname, 'mock-finished-dir')
            }
        });
        const stack = new nimbus_cdk_stack_1.ApiGatewayStack(app, 'TestStack');
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
        template.hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: 'PredictRestApi'
        });
        template.hasResourceProperties('AWS::ApiGateway::Stage', {
            StageName: 'prod'
        });
        (0, globals_1.expect)(true).toBe(true);
    });
    // test('dummy test', () => {
    //   expect(true).toBe(true);
    // });
    // test('creates default Lambda function', () => {
    //   // ARRANGE
    //   const app = new cdk.App({
    //     context: {
    //       'finishedDirPath': path.join(__dirname, 'mock-finished-dir')
    //     }
    //   });
    //   const stack = new ApiGatewayStack(app, 'TestStack');
    //   // ACT
    //   const template = Template.fromStack(stack);
    //   // ASSERT
    //   template.hasResourceProperties('AWS::Lambda::Function', {
    //     Runtime: 'nodejs20.x',
    //     Handler: 'index.handler'
    //   });
    // });
    // test('creates API Gateway method for root path', () => {
    //   // ARRANGE
    //   const app = new cdk.App({
    //     context: {
    //       'finishedDirPath': path.join(__dirname, 'mock-finished-dir')
    //     }
    //   });
    //   const stack = new ApiGatewayStack(app, 'TestStack');
    //   // ACT
    //   const template = Template.fromStack(stack);
    //   // ASSERT
    //   template.hasResourceProperties('AWS::ApiGateway::Method', {
    //     HttpMethod: 'GET',
    //     ResourceId: {
    //       'Fn::GetAtt': [
    //         Match.anyValue(),
    //         'RootResourceId'
    //       ]
    //     }
    //   });
    // });
    // test('throws error when finishedDirPath is not provided', () => {
    //   // ARRANGE
    //   const app = new cdk.App();
    //   // ACT & ASSERT
    //   expect(() => {
    //     new ApiGatewayStack(app, 'TestStack');
    //   }).toThrow('CDK context variable "finishedDirPath" is required and must be a string.');
    // });
    // test('creates resources for valid model configurations', () => {
    //   // ARRANGE
    //   const mockModelConfig = JSON.stringify([{
    //     modelName: 'test-model',
    //     modelType: 'test-type',
    //     modelPathOrName: 'test-path'
    //   }]);
    //   // Create mock directory structure
    //   const mockDirPath = path.join(__dirname, 'mock-finished-dir');
    //   const mockModelPath = path.join(mockDirPath, 'test-model');
    //   // Mock fs operations (you'll need to set up the directory structure)
    //   const app = new cdk.App({
    //     context: {
    //       'finishedDirPath': mockDirPath
    //     }
    //   });
    //   const stack = new ApiGatewayStack(app, 'TestStack');
    //   // ACT
    //   const template = Template.fromStack(stack);
    //   // ASSERT
    //   template.hasResourceProperties('AWS::Lambda::Function', {
    //     MemorySize: 3008,
    //     Timeout: 60
    //   });
    //   // Verify CORS configuration
    //   template.hasResourceProperties('AWS::ApiGateway::Method', {
    //     HttpMethod: 'OPTIONS',
    //     Integration: {
    //       IntegrationResponses: [{
    //         ResponseParameters: {
    //           'method.response.header.Access-Control-Allow-Headers': "'Content-Type'",
    //           'method.response.header.Access-Control-Allow-Methods': "'POST,OPTIONS'",
    //           'method.response.header.Access-Control-Allow-Origin': "'*'"
    //         }
    //       }]
    //     }
    //   });
    // });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktY2RrLXByb2plY3QudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15LWNkay1wcm9qZWN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBdUQ7QUFDdkQsbUNBQW1DO0FBQ25DLHVEQUFrRDtBQUNsRCw4REFBMEQ7QUFDMUQsNkJBQTZCO0FBRTdCLElBQUEsa0JBQVEsRUFBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsSUFBQSxjQUFJLEVBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1FBQ3ZELFVBQVU7UUFDVixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUM7WUFDdEIsT0FBTyxFQUFFO2dCQUNQLGlCQUFpQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG1CQUFtQixDQUFDO2FBQzdEO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsSUFBSSxrQ0FBZSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVwRCxNQUFNLFFBQVEsR0FBRyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUzQyxRQUFRLENBQUMsZUFBZSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hELFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQywwQkFBMEIsRUFBRTtZQUN6RCxJQUFJLEVBQUUsZ0JBQWdCO1NBQ3ZCLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN2RCxTQUFTLEVBQUUsTUFBTTtTQUNsQixDQUFDLENBQUM7UUFFSCxJQUFBLGdCQUFNLEVBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUgsNkJBQTZCO0lBQzdCLDZCQUE2QjtJQUM3QixNQUFNO0lBQ04sa0RBQWtEO0lBQ2xELGVBQWU7SUFDZiw4QkFBOEI7SUFDOUIsaUJBQWlCO0lBQ2pCLHFFQUFxRTtJQUNyRSxRQUFRO0lBQ1IsUUFBUTtJQUNSLHlEQUF5RDtJQUV6RCxXQUFXO0lBQ1gsZ0RBQWdEO0lBRWhELGNBQWM7SUFDZCw4REFBOEQ7SUFDOUQsNkJBQTZCO0lBQzdCLCtCQUErQjtJQUMvQixRQUFRO0lBQ1IsTUFBTTtJQUVOLDJEQUEyRDtJQUMzRCxlQUFlO0lBQ2YsOEJBQThCO0lBQzlCLGlCQUFpQjtJQUNqQixxRUFBcUU7SUFDckUsUUFBUTtJQUNSLFFBQVE7SUFDUix5REFBeUQ7SUFFekQsV0FBVztJQUNYLGdEQUFnRDtJQUVoRCxjQUFjO0lBQ2QsZ0VBQWdFO0lBQ2hFLHlCQUF5QjtJQUN6QixvQkFBb0I7SUFDcEIsd0JBQXdCO0lBQ3hCLDRCQUE0QjtJQUM1QiwyQkFBMkI7SUFDM0IsVUFBVTtJQUNWLFFBQVE7SUFDUixRQUFRO0lBQ1IsTUFBTTtJQUVOLG9FQUFvRTtJQUNwRSxlQUFlO0lBQ2YsK0JBQStCO0lBRS9CLG9CQUFvQjtJQUNwQixtQkFBbUI7SUFDbkIsNkNBQTZDO0lBQzdDLDRGQUE0RjtJQUM1RixNQUFNO0lBRU4sbUVBQW1FO0lBQ25FLGVBQWU7SUFDZiw4Q0FBOEM7SUFDOUMsK0JBQStCO0lBQy9CLDhCQUE4QjtJQUM5QixtQ0FBbUM7SUFDbkMsU0FBUztJQUVULHVDQUF1QztJQUN2QyxtRUFBbUU7SUFDbkUsZ0VBQWdFO0lBRWhFLDBFQUEwRTtJQUUxRSw4QkFBOEI7SUFDOUIsaUJBQWlCO0lBQ2pCLHVDQUF1QztJQUN2QyxRQUFRO0lBQ1IsUUFBUTtJQUNSLHlEQUF5RDtJQUV6RCxXQUFXO0lBQ1gsZ0RBQWdEO0lBRWhELGNBQWM7SUFDZCw4REFBOEQ7SUFDOUQsd0JBQXdCO0lBQ3hCLGtCQUFrQjtJQUNsQixRQUFRO0lBRVIsaUNBQWlDO0lBQ2pDLGdFQUFnRTtJQUNoRSw2QkFBNkI7SUFDN0IscUJBQXFCO0lBQ3JCLGlDQUFpQztJQUNqQyxnQ0FBZ0M7SUFDaEMscUZBQXFGO0lBQ3JGLHFGQUFxRjtJQUNyRix3RUFBd0U7SUFDeEUsWUFBWTtJQUNaLFdBQVc7SUFDWCxRQUFRO0lBQ1IsUUFBUTtJQUNSLE1BQU07QUFDUixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlc2NyaWJlLCBleHBlY3QsIHRlc3QgfSBmcm9tICdAamVzdC9nbG9iYWxzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQXBpR2F0ZXdheVN0YWNrIH0gZnJvbSAnLi4vbGliL25pbWJ1cy1jZGstc3RhY2snO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuZGVzY3JpYmUoJ0FwaUdhdGV3YXlTdGFjaycsICgpID0+IHtcbiAgdGVzdCgnY3JlYXRlcyBSRVNUIEFQSSB3aXRoIGRlZmF1bHQgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAvLyBBUlJBTkdFXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnZmluaXNoZWREaXJQYXRoJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJ21vY2stZmluaXNoZWQtZGlyJylcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBBcGlHYXRld2F5U3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLCAxKTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzdEFwaScsIHtcbiAgICAgIE5hbWU6ICdQcmVkaWN0UmVzdEFwaSdcbiAgICB9KTtcblxuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpTdGFnZScsIHtcbiAgICAgIFN0YWdlTmFtZTogJ3Byb2QnXG4gICAgfSk7XG5cbiAgICBleHBlY3QodHJ1ZSkudG9CZSh0cnVlKTtcbiAgfSk7XG5cbiAgLy8gdGVzdCgnZHVtbXkgdGVzdCcsICgpID0+IHtcbiAgLy8gICBleHBlY3QodHJ1ZSkudG9CZSh0cnVlKTtcbiAgLy8gfSk7XG4gIC8vIHRlc3QoJ2NyZWF0ZXMgZGVmYXVsdCBMYW1iZGEgZnVuY3Rpb24nLCAoKSA9PiB7XG4gIC8vICAgLy8gQVJSQU5HRVxuICAvLyAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHtcbiAgLy8gICAgIGNvbnRleHQ6IHtcbiAgLy8gICAgICAgJ2ZpbmlzaGVkRGlyUGF0aCc6IHBhdGguam9pbihfX2Rpcm5hbWUsICdtb2NrLWZpbmlzaGVkLWRpcicpXG4gIC8vICAgICB9XG4gIC8vICAgfSk7XG4gIC8vICAgY29uc3Qgc3RhY2sgPSBuZXcgQXBpR2F0ZXdheVN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgIFxuICAvLyAgIC8vIEFDVFxuICAvLyAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAvLyAgIC8vIEFTU0VSVFxuICAvLyAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAvLyAgICAgUnVudGltZTogJ25vZGVqczIwLngnLFxuICAvLyAgICAgSGFuZGxlcjogJ2luZGV4LmhhbmRsZXInXG4gIC8vICAgfSk7XG4gIC8vIH0pO1xuXG4gIC8vIHRlc3QoJ2NyZWF0ZXMgQVBJIEdhdGV3YXkgbWV0aG9kIGZvciByb290IHBhdGgnLCAoKSA9PiB7XG4gIC8vICAgLy8gQVJSQU5HRVxuICAvLyAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHtcbiAgLy8gICAgIGNvbnRleHQ6IHtcbiAgLy8gICAgICAgJ2ZpbmlzaGVkRGlyUGF0aCc6IHBhdGguam9pbihfX2Rpcm5hbWUsICdtb2NrLWZpbmlzaGVkLWRpcicpXG4gIC8vICAgICB9XG4gIC8vICAgfSk7XG4gIC8vICAgY29uc3Qgc3RhY2sgPSBuZXcgQXBpR2F0ZXdheVN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgIFxuICAvLyAgIC8vIEFDVFxuICAvLyAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAvLyAgIC8vIEFTU0VSVFxuICAvLyAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gIC8vICAgICBIdHRwTWV0aG9kOiAnR0VUJyxcbiAgLy8gICAgIFJlc291cmNlSWQ6IHtcbiAgLy8gICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gIC8vICAgICAgICAgTWF0Y2guYW55VmFsdWUoKSxcbiAgLy8gICAgICAgICAnUm9vdFJlc291cmNlSWQnXG4gIC8vICAgICAgIF1cbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gfSk7XG5cbiAgLy8gdGVzdCgndGhyb3dzIGVycm9yIHdoZW4gZmluaXNoZWREaXJQYXRoIGlzIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgLy8gICAvLyBBUlJBTkdFXG4gIC8vICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBcbiAgLy8gICAvLyBBQ1QgJiBBU1NFUlRcbiAgLy8gICBleHBlY3QoKCkgPT4ge1xuICAvLyAgICAgbmV3IEFwaUdhdGV3YXlTdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgLy8gICB9KS50b1Rocm93KCdDREsgY29udGV4dCB2YXJpYWJsZSBcImZpbmlzaGVkRGlyUGF0aFwiIGlzIHJlcXVpcmVkIGFuZCBtdXN0IGJlIGEgc3RyaW5nLicpO1xuICAvLyB9KTtcblxuICAvLyB0ZXN0KCdjcmVhdGVzIHJlc291cmNlcyBmb3IgdmFsaWQgbW9kZWwgY29uZmlndXJhdGlvbnMnLCAoKSA9PiB7XG4gIC8vICAgLy8gQVJSQU5HRVxuICAvLyAgIGNvbnN0IG1vY2tNb2RlbENvbmZpZyA9IEpTT04uc3RyaW5naWZ5KFt7XG4gIC8vICAgICBtb2RlbE5hbWU6ICd0ZXN0LW1vZGVsJyxcbiAgLy8gICAgIG1vZGVsVHlwZTogJ3Rlc3QtdHlwZScsXG4gIC8vICAgICBtb2RlbFBhdGhPck5hbWU6ICd0ZXN0LXBhdGgnXG4gIC8vICAgfV0pO1xuXG4gIC8vICAgLy8gQ3JlYXRlIG1vY2sgZGlyZWN0b3J5IHN0cnVjdHVyZVxuICAvLyAgIGNvbnN0IG1vY2tEaXJQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ21vY2stZmluaXNoZWQtZGlyJyk7XG4gIC8vICAgY29uc3QgbW9ja01vZGVsUGF0aCA9IHBhdGguam9pbihtb2NrRGlyUGF0aCwgJ3Rlc3QtbW9kZWwnKTtcbiAgICBcbiAgLy8gICAvLyBNb2NrIGZzIG9wZXJhdGlvbnMgKHlvdSdsbCBuZWVkIHRvIHNldCB1cCB0aGUgZGlyZWN0b3J5IHN0cnVjdHVyZSlcbiAgICBcbiAgLy8gICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7XG4gIC8vICAgICBjb250ZXh0OiB7XG4gIC8vICAgICAgICdmaW5pc2hlZERpclBhdGgnOiBtb2NrRGlyUGF0aFxuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyAgIGNvbnN0IHN0YWNrID0gbmV3IEFwaUdhdGV3YXlTdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICBcbiAgLy8gICAvLyBBQ1RcbiAgLy8gICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgLy8gICAvLyBBU1NFUlRcbiAgLy8gICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgLy8gICAgIE1lbW9yeVNpemU6IDMwMDgsXG4gIC8vICAgICBUaW1lb3V0OiA2MFxuICAvLyAgIH0pO1xuXG4gIC8vICAgLy8gVmVyaWZ5IENPUlMgY29uZmlndXJhdGlvblxuICAvLyAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gIC8vICAgICBIdHRwTWV0aG9kOiAnT1BUSU9OUycsXG4gIC8vICAgICBJbnRlZ3JhdGlvbjoge1xuICAvLyAgICAgICBJbnRlZ3JhdGlvblJlc3BvbnNlczogW3tcbiAgLy8gICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgLy8gICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiBcIidDb250ZW50LVR5cGUnXCIsXG4gIC8vICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogXCInUE9TVCxPUFRJT05TJ1wiLFxuICAvLyAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInKidcIlxuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfV1cbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gfSk7XG59KTsiXX0=