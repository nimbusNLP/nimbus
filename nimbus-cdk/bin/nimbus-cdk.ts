#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { NimbusApiStack } from '../lib/nimbus-api-stack';
import { NimbusLambdaStack } from '../lib/nimbus-lambda-stack'; 

const app = new cdk.App();
new NimbusApiStack(app, 'NimbusCdkStack');

new NimbusLambdaStack(app, 'myModel', {name: 'myModel'});

// new NimbusLambdaStack(app, 'Model2', { name: 'name2'});


