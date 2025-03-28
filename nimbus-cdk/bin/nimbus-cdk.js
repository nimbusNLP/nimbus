#!/usr/bin/env node
"use strict";
// import * as cdk from 'aws-cdk-lib';
// import { NimbusCdkStack } from '../lib/nimbus-cdk-stack';
Object.defineProperty(exports, "__esModule", { value: true });
// const app = new cdk.App();
// new NimbusCdkStack(app, 'NimbusCdkStack', {
//     /* If you don't specify 'env', this stack will be environment-agnostic.
//      * Account/Region-dependent features and context lookups will not work,
//      * but a single synthesized template can be deployed anywhere. */
//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//   // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   // env: { account: '123456789012', region: 'us-east-1' },
//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });
const cdk = require("aws-cdk-lib");
const nimbus_cdk_stack_1 = require("../lib/nimbus-cdk-stack");
const app = new cdk.App();
new nimbus_cdk_stack_1.ApiGatewayStack(app, 'ApiGatewayStack', {
// You can pass environment or region details here if needed.
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1jZGsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxzQ0FBc0M7QUFDdEMsNERBQTREOztBQUU1RCw2QkFBNkI7QUFDN0IsOENBQThDO0FBQzlDLDhFQUE4RTtBQUM5RSw4RUFBOEU7QUFDOUUsd0VBQXdFO0FBRXhFLDRFQUE0RTtBQUM1RSx3RUFBd0U7QUFDeEUsa0dBQWtHO0FBRWxHLCtFQUErRTtBQUMvRSx1Q0FBdUM7QUFDdkMsOERBQThEO0FBRTlELG1HQUFtRztBQUNuRyxNQUFNO0FBR04sbUNBQW1DO0FBQ25DLDhEQUEwRDtBQUUxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLGtDQUFlLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFO0FBQzFDLDZEQUE2RDtDQUM5RCxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4vLyBpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuLy8gaW1wb3J0IHsgTmltYnVzQ2RrU3RhY2sgfSBmcm9tICcuLi9saWIvbmltYnVzLWNkay1zdGFjayc7XG5cbi8vIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4vLyBuZXcgTmltYnVzQ2RrU3RhY2soYXBwLCAnTmltYnVzQ2RrU3RhY2snLCB7XG4vLyAgICAgLyogSWYgeW91IGRvbid0IHNwZWNpZnkgJ2VudicsIHRoaXMgc3RhY2sgd2lsbCBiZSBlbnZpcm9ubWVudC1hZ25vc3RpYy5cbi8vICAgICAgKiBBY2NvdW50L1JlZ2lvbi1kZXBlbmRlbnQgZmVhdHVyZXMgYW5kIGNvbnRleHQgbG9va3VwcyB3aWxsIG5vdCB3b3JrLFxuLy8gICAgICAqIGJ1dCBhIHNpbmdsZSBzeW50aGVzaXplZCB0ZW1wbGF0ZSBjYW4gYmUgZGVwbG95ZWQgYW55d2hlcmUuICovXG5cbi8vICAgLyogVW5jb21tZW50IHRoZSBuZXh0IGxpbmUgdG8gc3BlY2lhbGl6ZSB0aGlzIHN0YWNrIGZvciB0aGUgQVdTIEFjY291bnRcbi8vICAgICogYW5kIFJlZ2lvbiB0aGF0IGFyZSBpbXBsaWVkIGJ5IHRoZSBjdXJyZW50IENMSSBjb25maWd1cmF0aW9uLiAqL1xuLy8gICAvLyBlbnY6IHsgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCwgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04gfSxcblxuLy8gICAvKiBVbmNvbW1lbnQgdGhlIG5leHQgbGluZSBpZiB5b3Uga25vdyBleGFjdGx5IHdoYXQgQWNjb3VudCBhbmQgUmVnaW9uIHlvdVxuLy8gICAgKiB3YW50IHRvIGRlcGxveSB0aGUgc3RhY2sgdG8uICovXG4vLyAgIC8vIGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9LFxuXG4vLyAgIC8qIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvZW52aXJvbm1lbnRzLmh0bWwgKi9cbi8vIH0pO1xuXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBBcGlHYXRld2F5U3RhY2sgfSBmcm9tICcuLi9saWIvbmltYnVzLWNkay1zdGFjayc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBBcGlHYXRld2F5U3RhY2soYXBwLCAnQXBpR2F0ZXdheVN0YWNrJywge1xuICAvLyBZb3UgY2FuIHBhc3MgZW52aXJvbm1lbnQgb3IgcmVnaW9uIGRldGFpbHMgaGVyZSBpZiBuZWVkZWQuXG59KTtcblxuYXBwLnN5bnRoKCk7Il19