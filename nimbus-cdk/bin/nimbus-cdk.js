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
new nimbus_cdk_stack_1.ApiGatewayStack(app, 'ApiGatewayStack', {});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1jZGsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxzQ0FBc0M7QUFDdEMsNERBQTREOztBQUU1RCw2QkFBNkI7QUFDN0IsOENBQThDO0FBQzlDLDhFQUE4RTtBQUM5RSw4RUFBOEU7QUFDOUUsd0VBQXdFO0FBRXhFLDRFQUE0RTtBQUM1RSx3RUFBd0U7QUFDeEUsa0dBQWtHO0FBRWxHLCtFQUErRTtBQUMvRSx1Q0FBdUM7QUFDdkMsOERBQThEO0FBRTlELG1HQUFtRztBQUNuRyxNQUFNO0FBR04sbUNBQW1DO0FBQ25DLDhEQUEwRDtBQUUxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLGtDQUFlLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFLEVBQzNDLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8vIGltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG4vLyBpbXBvcnQgeyBOaW1idXNDZGtTdGFjayB9IGZyb20gJy4uL2xpYi9uaW1idXMtY2RrLXN0YWNrJztcblxuLy8gY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbi8vIG5ldyBOaW1idXNDZGtTdGFjayhhcHAsICdOaW1idXNDZGtTdGFjaycsIHtcbi8vICAgICAvKiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSAnZW52JywgdGhpcyBzdGFjayB3aWxsIGJlIGVudmlyb25tZW50LWFnbm9zdGljLlxuLy8gICAgICAqIEFjY291bnQvUmVnaW9uLWRlcGVuZGVudCBmZWF0dXJlcyBhbmQgY29udGV4dCBsb29rdXBzIHdpbGwgbm90IHdvcmssXG4vLyAgICAgICogYnV0IGEgc2luZ2xlIHN5bnRoZXNpemVkIHRlbXBsYXRlIGNhbiBiZSBkZXBsb3llZCBhbnl3aGVyZS4gKi9cblxuLy8gICAvKiBVbmNvbW1lbnQgdGhlIG5leHQgbGluZSB0byBzcGVjaWFsaXplIHRoaXMgc3RhY2sgZm9yIHRoZSBBV1MgQWNjb3VudFxuLy8gICAgKiBhbmQgUmVnaW9uIHRoYXQgYXJlIGltcGxpZWQgYnkgdGhlIGN1cnJlbnQgQ0xJIGNvbmZpZ3VyYXRpb24uICovXG4vLyAgIC8vIGVudjogeyBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULCByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTiB9LFxuXG4vLyAgIC8qIFVuY29tbWVudCB0aGUgbmV4dCBsaW5lIGlmIHlvdSBrbm93IGV4YWN0bHkgd2hhdCBBY2NvdW50IGFuZCBSZWdpb24geW91XG4vLyAgICAqIHdhbnQgdG8gZGVwbG95IHRoZSBzdGFjayB0by4gKi9cbi8vICAgLy8gZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG5cbi8vICAgLyogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2xhdGVzdC9ndWlkZS9lbnZpcm9ubWVudHMuaHRtbCAqL1xuLy8gfSk7XG5cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEFwaUdhdGV3YXlTdGFjayB9IGZyb20gJy4uL2xpYi9uaW1idXMtY2RrLXN0YWNrJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IEFwaUdhdGV3YXlTdGFjayhhcHAsICdBcGlHYXRld2F5U3RhY2snLCB7XG59KTtcblxuYXBwLnN5bnRoKCk7Il19