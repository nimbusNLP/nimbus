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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay1zdGFjay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmltYnVzLWNkay1zdGFjay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QyxPQUFPLEtBQUssR0FBRyxNQUFNLGFBQWEsQ0FBQztBQUNuQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFN0QsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixFQUFFLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1FBQ3BFLG1CQUFtQjtRQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUUxQixtRkFBbUY7UUFDbkYsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBFQUEwRSxDQUFDLENBQUM7SUFDekYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlc2NyaWJlLCBpdCwgZXhwZWN0IH0gZnJvbSAndml0ZXN0JztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBBcGlHYXRld2F5U3RhY2sgfSBmcm9tICcuLi9saWIvbmltYnVzLWNkay1zdGFjay5qcyc7XG5cbmRlc2NyaWJlKCdBcGlHYXRld2F5U3RhY2snLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3Igd2hlbiBmaW5pc2hlZERpclBhdGggaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIC8vIENyZWF0ZSBhIENESyBhcHBcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIFxuICAgIC8vIEV4cGVjdCB0aGUgc3RhY2sgY3JlYXRpb24gdG8gdGhyb3cgYW4gZXJyb3Igd2hlbiBmaW5pc2hlZERpclBhdGggaXMgbm90IHByb3ZpZGVkXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBBcGlHYXRld2F5U3RhY2soYXBwLCAnVGVzdFN0YWNrJywge30pO1xuICAgIH0pLnRvVGhyb3coJ0NESyBjb250ZXh0IHZhcmlhYmxlIFwiZmluaXNoZWREaXJQYXRoXCIgaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgYSBzdHJpbmcuJyk7XG4gIH0pO1xufSk7XG4iXX0=