#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStack } from '../lib/nimbus-cdk-stack';

const app = new cdk.App();

new ApiGatewayStack(app, 'ApiGatewayStack', {
});

app.synth();