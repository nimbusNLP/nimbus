import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { ApiGatewayStack } from '../lib/nimbus-cdk-stack';
import * as path from 'path';
import * as fs from 'fs';


describe('ApiGatewayStack Model Resources', () => {
  const mockDirPath = path.join(__dirname, 'mock-finished-dir');
  const mockModelPath = path.join(mockDirPath, 'test-model');

  // Set up test directories and files before each test
  beforeEach(() => {
    // Create the directory structure
    fs.mkdirSync(mockDirPath, { recursive: true });
    fs.mkdirSync(mockModelPath, { recursive: true });

    // Create models.json
    const mockModelConfig = [{
      modelName: 'test-model',
      modelType: 'test-type',
      modelPathOrName: 'test-path'
    }];
    fs.writeFileSync(
      path.join(mockDirPath, 'models.json'),
      JSON.stringify(mockModelConfig)
    );

    // Create a mock Dockerfile (required for DockerImageFunction)
    fs.writeFileSync(
      path.join(mockModelPath, 'Dockerfile'),
      'FROM public.ecr.aws/lambda/nodejs:20'
    );
  });

  // Clean up test directories after each test
  afterEach(() => {
    fs.rmSync(mockDirPath, { recursive: true, force: true });
  });

  test('creates resources for valid model configurations', () => {
    // ARRANGE
    const app = new cdk.App({
      context: {
        'finishedDirPath': mockDirPath
      }
    });
    const stack = new ApiGatewayStack(app, 'TestStack');
    
    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    // Check for Docker Lambda function
    template.hasResourceProperties('AWS::Lambda::Function', {
      MemorySize: 3008,
      Timeout: 60
    });

    // Verify API Gateway resources
    template.resourceCountIs('AWS::ApiGateway::Resource', 2); // One for model, one for 'predict'

    // Verify CORS configuration
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      Integration: {
        IntegrationResponses: [{
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type'",
            'method.response.header.Access-Control-Allow-Methods': "'POST,OPTIONS'",
            'method.response.header.Access-Control-Allow-Origin': "'*'"
          }
        }]
      }
    });
  });
});

describe('ApiGatewayStack', () => {
  test('creates REST API with default configuration', () => {
    const app = new cdk.App({
      context: {
        'finishedDirPath': path.join(__dirname, 'mock-finished-dir')
      }
    });
    const stack = new ApiGatewayStack(app, 'TestStack');
    
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'PredictRestApi'
    });

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: 'prod'
    });

    expect(true).toBe(true);
  });

  test('creates default Lambda function', () => {
    const app = new cdk.App({
      context: {
        'finishedDirPath': path.join(__dirname, 'mock-finished-dir')
      }
    });
    const stack = new ApiGatewayStack(app, 'TestStack');

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs20.x',
      Handler: 'index.handler'
    });
  });

  test('creates API Gateway method for root path', () => {
    const app = new cdk.App({
      context: {
        'finishedDirPath': path.join(__dirname, 'mock-finished-dir')
      }
    });
    const stack = new ApiGatewayStack(app, 'TestStack');
    
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: {
        'Fn::GetAtt': [
          Match.anyValue(),
          'RootResourceId'
        ]
      }
    });
  });

  test('throws error when finishedDirPath is not provided', () => {
    const app = new cdk.App();
    
    expect(() => {
      new ApiGatewayStack(app, 'TestStack');
    }).toThrow('CDK context variable "finishedDirPath" is required and must be a string.');
  });

  test('creates resources for valid model configurations', () => {
    // ARRANGE
    const mockModelConfig = JSON.stringify([{
      modelName: 'test-model',
      modelType: 'fine-tuned',
      modelPathOrName: 'test-path'
    }]);

    // Create mock directory structure
    const mockDirPath = path.join(__dirname, 'mock-finished-dir');
    const mockModelPath = path.join(mockDirPath, 'test-model');
    
    // Mock fs operations (you'll need to set up the directory structure)
    
    const app = new cdk.App({
      context: {
        'finishedDirPath': mockDirPath
      }
    });
    const stack = new ApiGatewayStack(app, 'TestStack');
    
    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Lambda::Function', {
      MemorySize: 3008,
      Timeout: 60
    });

    // Verify CORS configuration
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      Integration: {
        IntegrationResponses: [{
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type'",
            'method.response.header.Access-Control-Allow-Methods': "'POST,OPTIONS'",
            'method.response.header.Access-Control-Allow-Origin': "'*'"
          }
        }]
      }
    });
  });
});