"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import * as MyCdkProject from '../lib/my-cdk-project-stack';
const vitest_1 = require("vitest");
// example test. To run these tests, uncomment this file along with the
// example resource in lib/my-cdk-project-stack.ts
(0, vitest_1.describe)('CDK Stack Tests', () => {
    (0, vitest_1.it)("SQS Queue Created", () => {
        //   const app = new cdk.App();
        //     // WHEN
        //   const stack = new MyCdkProject.MyCdkProjectStack(app, 'MyTestStack');
        //     // THEN
        //   const template = Template.fromStack(stack);
        //   template.hasResourceProperties('AWS::SQS::Queue', {
        //     VisibilityTimeout: 300
        //   });
        (0, vitest_1.expect)(true).toBe(true); // Placeholder assertion
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktY2RrLXByb2plY3QudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15LWNkay1wcm9qZWN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFDdEMscURBQXFEO0FBQ3JELCtEQUErRDtBQUMvRCxtQ0FBOEM7QUFFOUMsdUVBQXVFO0FBQ3ZFLGtEQUFrRDtBQUNsRCxJQUFBLGlCQUFRLEVBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQy9CLElBQUEsV0FBRSxFQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUMzQiwrQkFBK0I7UUFDL0IsY0FBYztRQUNkLDBFQUEwRTtRQUMxRSxjQUFjO1FBQ2QsZ0RBQWdEO1FBQ2hELHdEQUF3RDtRQUN4RCw2QkFBNkI7UUFDN0IsUUFBUTtRQUNSLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHdCQUF3QjtJQUNuRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbi8vIGltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG4vLyBpbXBvcnQgKiBhcyBNeUNka1Byb2plY3QgZnJvbSAnLi4vbGliL215LWNkay1wcm9qZWN0LXN0YWNrJztcbmltcG9ydCB7IGRlc2NyaWJlLCBpdCwgZXhwZWN0IH0gZnJvbSAndml0ZXN0JztcblxuLy8gZXhhbXBsZSB0ZXN0LiBUbyBydW4gdGhlc2UgdGVzdHMsIHVuY29tbWVudCB0aGlzIGZpbGUgYWxvbmcgd2l0aCB0aGVcbi8vIGV4YW1wbGUgcmVzb3VyY2UgaW4gbGliL215LWNkay1wcm9qZWN0LXN0YWNrLnRzXG5kZXNjcmliZSgnQ0RLIFN0YWNrIFRlc3RzJywgKCkgPT4ge1xuICBpdChcIlNRUyBRdWV1ZSBDcmVhdGVkXCIsICgpID0+IHtcbiAgICAvLyAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgLy8gICAgIC8vIFdIRU5cbiAgICAvLyAgIGNvbnN0IHN0YWNrID0gbmV3IE15Q2RrUHJvamVjdC5NeUNka1Byb2plY3RTdGFjayhhcHAsICdNeVRlc3RTdGFjaycpO1xuICAgIC8vICAgICAvLyBUSEVOXG4gICAgLy8gICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgLy8gICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U1FTOjpRdWV1ZScsIHtcbiAgICAvLyAgICAgVmlzaWJpbGl0eVRpbWVvdXQ6IDMwMFxuICAgIC8vICAgfSk7XG4gICAgZXhwZWN0KHRydWUpLnRvQmUodHJ1ZSk7IC8vIFBsYWNlaG9sZGVyIGFzc2VydGlvblxuICB9KTtcbn0pO1xuIl19