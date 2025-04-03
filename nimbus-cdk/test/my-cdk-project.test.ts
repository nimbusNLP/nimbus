import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as NimbusStack from '../lib/nimbus-cdk-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/my-cdk-project-stack.ts
describe('ApiGatewayStack', () => {
  test('API is created', () => {
    const app = new cdk.App();
    const stack = new NimbusStack.ApiGatewayStack(app, "ApiGatewayStack");

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'ApiGatewayStack',
    });
  });

});
