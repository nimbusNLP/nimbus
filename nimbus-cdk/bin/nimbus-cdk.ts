#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { NimbusApiStack } from '../lib/nimbus-api-stack';
import { NimbusLambdaStack } from '../lib/nimbus-lambda-stack'; 

const app = new cdk.App();
new NimbusApiStack(app, 'NimbusCdkStack');

new NimbusLambdaStack(app, 'my2Model', {name: 'my2Model'});

// new NimbusLambdaStack(app, 'Model2', { name: 'name2'});


// THE BELOW IS ANOTHER WAY TO DO IT
// const apiStack = new NimbusApiStack(app, 'NimbusApiStack');
// new NimbusLambdaStack(app, 'ModelALambdaStack', {
//   name: 'modelA',
//   apiId: apiStack.apiId
// });