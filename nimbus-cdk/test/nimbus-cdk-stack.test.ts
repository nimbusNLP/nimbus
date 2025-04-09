import { describe, it, expect } from 'vitest';
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStack } from '../lib/nimbus-cdk-stack.js';

describe('ApiGatewayStack', () => {
  it('should throw an error when finishedDirPath is not provided', () => {
    // Create a CDK app
    const app = new cdk.App();
    
    // Expect the stack creation to throw an error when finishedDirPath is not provided
    expect(() => {
      new ApiGatewayStack(app, 'TestStack', {});
    }).toThrow('CDK context variable "finishedDirPath" is required and must be a string.');
  });
});
