"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NimbusApiStack = void 0;
const cdk = require("aws-cdk-lib");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class NimbusApiStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new apigateway.RestApi(this, 'NimbusRestApi', {
            restApiName: 'NimbuRestApi',
            // potentially add an api key
        });
        // potential api key
        // potential usagePlan
        new cdk.CfnOutput(this, 'url', {
            value: api.url ?? 'Something went wrong',
        });
    }
}
exports.NimbusApiStack = NimbusApiStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWFwaS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1hcGktc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBR25DLHlEQUF5RDtBQUV6RCxNQUFhLGNBQWUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMzQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3hELFdBQVcsRUFBRSxjQUFjO1lBQzNCLDZCQUE2QjtTQUM5QixDQUFDLENBQUM7UUFFSCxvQkFBb0I7UUFFcEIsc0JBQXNCO1FBRXRCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQzdCLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLHNCQUFzQjtTQUN6QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFqQkQsd0NBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcblxuZXhwb3J0IGNsYXNzIE5pbWJ1c0FwaVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnTmltYnVzUmVzdEFwaScsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiAnTmltYnVSZXN0QXBpJyxcbiAgICAgIC8vIHBvdGVudGlhbGx5IGFkZCBhbiBhcGkga2V5XG4gICAgfSk7XG5cbiAgICAvLyBwb3RlbnRpYWwgYXBpIGtleVxuXG4gICAgLy8gcG90ZW50aWFsIHVzYWdlUGxhblxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ3VybCcsIHtcbiAgICAgIHZhbHVlOiBhcGkudXJsID8/ICdTb21ldGhpbmcgd2VudCB3cm9uZycsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==