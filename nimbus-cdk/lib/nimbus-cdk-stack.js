"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const apigateway = __importStar(require("aws-cdk-lib/aws-apigateway"));
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ApiGatewayStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const finishedDirPath = this.node.tryGetContext("finishedDirPath");
        if (!finishedDirPath || typeof finishedDirPath !== "string") {
            throw new Error('CDK context variable "finishedDirPath" is required and must be a string.');
        }
        if (!fs.existsSync(finishedDirPath)) {
            console.warn(`❌  Warning: Provided finishedDirPath does not exist: ${finishedDirPath}`);
        }
        const api = new apigateway.RestApi(this, "PredictRestApi", {
            restApiName: "PredictRestApi",
            deployOptions: {
                stageName: "prod",
            },
        });
        api.root.addCorsPreflight({
            allowOrigins: apigateway.Cors.ALL_ORIGINS, // Or apigateway.Cors.ALL_ORIGINS
            allowMethods: ["GET", "OPTIONS"], // Methods for the root endpoint
            allowHeaders: ["Content-Type", "Authorization"], // Common headers
        });
        // Use a hardcoded path to avoid issues with path resolution
        const configPath = path.resolve(__dirname, '../../nimbus-cli/nimbus-config.json');
        console.log(`Looking for config file at: ${configPath}`);
        let modelsPath;
        try {
            modelsPath = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            console.log(`Found config file with localStorage path: ${modelsPath.localStorage}`);
        }
        catch (error) {
            console.error(`Error reading config file: ${error}`);
            // Fallback to using the finishedDirPath directly
            modelsPath = { localStorage: path.dirname(finishedDirPath) };
            console.log(`Using fallback localStorage path: ${modelsPath.localStorage}`);
        }
        // Use the finishedDirPath directly for models.json
        const modelsJSONPath = path.join(finishedDirPath, 'models.json');
        console.log(`Looking for models.json at: ${modelsJSONPath}`);
        let modelsJSON;
        try {
            if (fs.existsSync(modelsJSONPath)) {
                modelsJSON = fs.readFileSync(modelsJSONPath, 'utf8');
                console.log(`Found models.json file`);
            }
            else {
                // If models.json doesn't exist, create an empty array
                modelsJSON = '[]';
                console.log(`models.json not found, using empty array`);
            }
        }
        catch (error) {
            console.error(`Error reading models.json: ${error}`);
            // Fallback to empty array
            modelsJSON = '[]';
            console.log(`Error reading models.json, using empty array`);
        }
        const parsedModels = { models: [] };
        try {
            JSON.parse(modelsJSON).forEach((obj) => {
                parsedModels.models.push(obj.modelName);
            });
        }
        catch (error) {
            console.error(`Error parsing models.json: ${error}`);
        }
        const defaultLambda = new lambda.Function(this, "DefaultLambda", {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "index.handler",
            code: lambda.Code.fromInline(`exports.handler = async () => {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
            body: '${JSON.stringify(parsedModels)}'
          };
        };`),
        });
        api.root.addMethod("GET", new apigateway.LambdaIntegration(defaultLambda));
        const modelsConfigPath = path.join(finishedDirPath, "models.json");
        let models = [];
        if (fs.existsSync(modelsConfigPath)) {
            try {
                models = JSON.parse(fs.readFileSync(modelsConfigPath, "utf8"));
            }
            catch (error) {
                console.error(`❌  Error reading or parsing models.json from ${modelsConfigPath}:`, error);
            }
        }
        models.forEach((model) => {
            const modelDirPath = path.join(finishedDirPath, model.modelName);
            if (!fs.existsSync(modelDirPath)) {
                console.warn(`❌  Warning: Model directory does not exist, skipping deployment for ${model.modelName}: ${modelDirPath}`);
                return;
            }
            const modelLambda = new lambda.DockerImageFunction(this, `Lambda_${model.modelName}`, {
                code: lambda.DockerImageCode.fromImageAsset(modelDirPath, {
                    platform: aws_ecr_assets_1.Platform.LINUX_AMD64,
                }),
                memorySize: 3008,
                timeout: cdk.Duration.seconds(60),
            });
            const modelResource = api.root.addResource(model.modelName);
            const predictResource = modelResource.addResource("predict");
            predictResource.addCorsPreflight({
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: ["POST", "OPTIONS"],
                allowHeaders: ["Content-Type"],
            });
            predictResource.addMethod("POST", new apigateway.LambdaIntegration(modelLambda));
            new cdk.CfnOutput(this, `ModelEndpoint_${model.modelName}`, {
                value: `${api.url}${model.modelName}/predict`,
            });
        });
        new cdk.CfnOutput(this, "RestApiUrl", {
            value: api.url,
        });
    }
}
exports.ApiGatewayStack = ApiGatewayStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltYnVzLWNkay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pbWJ1cy1jZGstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQW1DO0FBQ25DLCtEQUFpRDtBQUNqRCx1RUFBeUQ7QUFFekQsK0RBQXNEO0FBQ3RELHVDQUF5QjtBQUN6QiwyQ0FBNkI7QUFTN0IsTUFBYSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVuRSxJQUFJLENBQUMsZUFBZSxJQUFJLE9BQU8sZUFBZSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzVELE1BQU0sSUFBSSxLQUFLLENBQ2IsMEVBQTBFLENBQzNFLENBQUM7UUFDSixDQUFDO1FBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQztZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUNWLHdEQUF3RCxlQUFlLEVBQUUsQ0FDMUUsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3pELFdBQVcsRUFBRSxnQkFBZ0I7WUFDN0IsYUFBYSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxNQUFNO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUN4QixZQUFZLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsaUNBQWlDO1lBQzVFLFlBQVks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LWxpYlwiO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lY3ItYXNzZXRzXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcblxuaW50ZXJmYWNlIE1vZGVsQ29uZmlnIHtcbiAgbW9kZWxOYW1lOiBzdHJpbmc7XG4gIG1vZGVsVHlwZTogc3RyaW5nO1xuICBtb2RlbFBhdGhPck5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBBcGlHYXRld2F5U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBmaW5pc2hlZERpclBhdGggPSB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChcImZpbmlzaGVkRGlyUGF0aFwiKTtcblxuICAgIGlmICghZmluaXNoZWREaXJQYXRoIHx8IHR5cGVvZiBmaW5pc2hlZERpclBhdGggIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0NESyBjb250ZXh0IHZhcmlhYmxlIFwiZmluaXNoZWREaXJQYXRoXCIgaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgYSBzdHJpbmcuJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbmlzaGVkRGlyUGF0aCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYOKdjCAgV2FybmluZzogUHJvdmlkZWQgZmluaXNoZWREaXJQYXRoIGRvZXMgbm90IGV4aXN0OiAke2ZpbmlzaGVkRGlyUGF0aH1gLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsIFwiUHJlZGljdFJlc3RBcGlcIiwge1xuICAgICAgcmVzdEFwaU5hbWU6IFwiUHJlZGljdFJlc3RBcGlcIixcbiAgICAgIGRlcGxveU9wdGlvbnM6IHtcbiAgICAgICAgc3RhZ2VOYW1lOiBcInByb2RcIixcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgYXBpLnJvb3QuYWRkQ29yc1ByZWZsaWdodCh7XG4gICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUywgLy8gT3IgYXBpZ2F0ZXdheS5Db3JzLkFMTF9PUklHSU5TXG4gICAgICBhbGxvd01ldGhvZHM6IFtcIkdFVFwiLCBcIk9QVElPTlNcIl0sICAgICAgICAvLyBNZXRob2RzIGZvciB0aGUgcm9vdCBlbmRwb2ludFxuICAgICAgYWxsb3dIZWFkZXJzOiBbXCJDb250ZW50LVR5cGVcIiwgXCJBdXRob3JpemF0aW9uXCJdLCAvLyBDb21tb24gaGVhZGVyc1xuICAgIH0pO1xuICAgIFxuICAgIC8vIFVzZSBhIGhhcmRjb2RlZCBwYXRoIHRvIGF2b2lkIGlzc3VlcyB3aXRoIHBhdGggcmVzb2x1dGlvblxuICAgIGNvbnN0IGNvbmZpZ1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vbmltYnVzLWNsaS9uaW1idXMtY29uZmlnLmpzb24nKTtcbiAgICBjb25zb2xlLmxvZyhgTG9va2luZyBmb3IgY29uZmlnIGZpbGUgYXQ6ICR7Y29uZmlnUGF0aH1gKTtcbiAgICBcbiAgICBsZXQgbW9kZWxzUGF0aDtcbiAgICB0cnkge1xuICAgICAgbW9kZWxzUGF0aCA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNvbmZpZ1BhdGgsICd1dGY4JykpO1xuICAgICAgY29uc29sZS5sb2coYEZvdW5kIGNvbmZpZyBmaWxlIHdpdGggbG9jYWxTdG9yYWdlIHBhdGg6ICR7bW9kZWxzUGF0aC5sb2NhbFN0b3JhZ2V9YCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHJlYWRpbmcgY29uZmlnIGZpbGU6ICR7ZXJyb3J9YCk7XG4gICAgICAvLyBGYWxsYmFjayB0byB1c2luZyB0aGUgZmluaXNoZWREaXJQYXRoIGRpcmVjdGx5XG4gICAgICBtb2RlbHNQYXRoID0geyBsb2NhbFN0b3JhZ2U6IHBhdGguZGlybmFtZShmaW5pc2hlZERpclBhdGgpIH07XG4gICAgICBjb25zb2xlLmxvZyhgVXNpbmcgZmFsbGJhY2sgbG9jYWxTdG9yYWdlIHBhdGg6ICR7bW9kZWxzUGF0aC5sb2NhbFN0b3JhZ2V9YCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFVzZSB0aGUgZmluaXNoZWREaXJQYXRoIGRpcmVjdGx5IGZvciBtb2RlbHMuanNvblxuICAgIGNvbnN0IG1vZGVsc0pTT05QYXRoID0gcGF0aC5qb2luKGZpbmlzaGVkRGlyUGF0aCwgJ21vZGVscy5qc29uJyk7XG4gICAgY29uc29sZS5sb2coYExvb2tpbmcgZm9yIG1vZGVscy5qc29uIGF0OiAke21vZGVsc0pTT05QYXRofWApO1xuICAgIFxuICAgIGxldCBtb2RlbHNKU09OO1xuICAgIHRyeSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhtb2RlbHNKU09OUGF0aCkpIHtcbiAgICAgICAgbW9kZWxzSlNPTiA9IGZzLnJlYWRGaWxlU3luYyhtb2RlbHNKU09OUGF0aCwgJ3V0ZjgnKTtcbiAgICAgICAgY29uc29sZS5sb2coYEZvdW5kIG1vZGVscy5qc29uIGZpbGVgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIG1vZGVscy5qc29uIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBhbiBlbXB0eSBhcnJheVxuICAgICAgICBtb2RlbHNKU09OID0gJ1tdJztcbiAgICAgICAgY29uc29sZS5sb2coYG1vZGVscy5qc29uIG5vdCBmb3VuZCwgdXNpbmcgZW1wdHkgYXJyYXlgKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgcmVhZGluZyBtb2RlbHMuanNvbjogJHtlcnJvcn1gKTtcbiAgICAgIC8vIEZhbGxiYWNrIHRvIGVtcHR5IGFycmF5XG4gICAgICBtb2RlbHNKU09OID0gJ1tdJztcbiAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZWFkaW5nIG1vZGVscy5qc29uLCB1c2luZyBlbXB0eSBhcnJheWApO1xuICAgIH1cblxuICAgIGludGVyZmFjZSBNb2RlbEVudHJ5IHtcbiAgICAgIG1vZGVsTmFtZTogc3RyaW5nO1xuICAgICAgbW9kZWxUeXBlOiBzdHJpbmc7XG4gICAgICBtb2RlbFBhdGhPck5hbWU6IHN0cmluZztcbiAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHBhcnNlZE1vZGVsczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0geyBtb2RlbHM6IFtdIH07XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIChKU09OLnBhcnNlKG1vZGVsc0pTT04pIGFzIE1vZGVsRW50cnlbXSkuZm9yRWFjaCgob2JqKSA9PiB7XG4gICAgICAgIHBhcnNlZE1vZGVscy5tb2RlbHMucHVzaChvYmoubW9kZWxOYW1lKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBwYXJzaW5nIG1vZGVscy5qc29uOiAke2Vycm9yfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIFwiRGVmYXVsdExhbWJkYVwiLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIGhhbmRsZXI6IFwiaW5kZXguaGFuZGxlclwiLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZShcbiAgICAgICAgYGV4cG9ydHMuaGFuZGxlciA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiBcIipcIiB9LFxuICAgICAgICAgICAgYm9keTogJyR7SlNPTi5zdHJpbmdpZnkocGFyc2VkTW9kZWxzKX0nXG4gICAgICAgICAgfTtcbiAgICAgICAgfTtgLFxuICAgICAgKSxcbiAgICB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoXCJHRVRcIiwgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZGVmYXVsdExhbWJkYSkpO1xuXG4gICAgY29uc3QgbW9kZWxzQ29uZmlnUGF0aCA9IHBhdGguam9pbihmaW5pc2hlZERpclBhdGgsIFwibW9kZWxzLmpzb25cIik7XG4gICAgbGV0IG1vZGVsczogTW9kZWxDb25maWdbXSA9IFtdO1xuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMobW9kZWxzQ29uZmlnUGF0aCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG1vZGVscyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKG1vZGVsc0NvbmZpZ1BhdGgsIFwidXRmOFwiKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIGDinYwgIEVycm9yIHJlYWRpbmcgb3IgcGFyc2luZyBtb2RlbHMuanNvbiBmcm9tICR7bW9kZWxzQ29uZmlnUGF0aH06YCxcbiAgICAgICAgICBlcnJvcixcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtb2RlbHMuZm9yRWFjaCgobW9kZWwpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsRGlyUGF0aCA9IHBhdGguam9pbihmaW5pc2hlZERpclBhdGgsIG1vZGVsLm1vZGVsTmFtZSk7XG5cbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhtb2RlbERpclBhdGgpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBg4p2MICBXYXJuaW5nOiBNb2RlbCBkaXJlY3RvcnkgZG9lcyBub3QgZXhpc3QsIHNraXBwaW5nIGRlcGxveW1lbnQgZm9yICR7bW9kZWwubW9kZWxOYW1lfTogJHttb2RlbERpclBhdGh9YCxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtb2RlbExhbWJkYSA9IG5ldyBsYW1iZGEuRG9ja2VySW1hZ2VGdW5jdGlvbihcbiAgICAgICAgdGhpcyxcbiAgICAgICAgYExhbWJkYV8ke21vZGVsLm1vZGVsTmFtZX1gLFxuICAgICAgICB7XG4gICAgICAgICAgY29kZTogbGFtYmRhLkRvY2tlckltYWdlQ29kZS5mcm9tSW1hZ2VBc3NldChtb2RlbERpclBhdGgsIHtcbiAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybS5MSU5VWF9BTUQ2NCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBtZW1vcnlTaXplOiAzMDA4LFxuICAgICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IG1vZGVsUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZShtb2RlbC5tb2RlbE5hbWUpO1xuICAgICAgY29uc3QgcHJlZGljdFJlc291cmNlID0gbW9kZWxSZXNvdXJjZS5hZGRSZXNvdXJjZShcInByZWRpY3RcIik7XG4gICAgICBwcmVkaWN0UmVzb3VyY2UuYWRkQ29yc1ByZWZsaWdodCh7XG4gICAgICAgIGFsbG93T3JpZ2luczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9PUklHSU5TLFxuICAgICAgICBhbGxvd01ldGhvZHM6IFtcIlBPU1RcIiwgXCJPUFRJT05TXCJdLFxuICAgICAgICBhbGxvd0hlYWRlcnM6IFtcIkNvbnRlbnQtVHlwZVwiXSxcbiAgICAgIH0pO1xuICAgICAgcHJlZGljdFJlc291cmNlLmFkZE1ldGhvZChcbiAgICAgICAgXCJQT1NUXCIsXG4gICAgICAgIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKG1vZGVsTGFtYmRhKSxcbiAgICAgICk7XG5cbiAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIGBNb2RlbEVuZHBvaW50XyR7bW9kZWwubW9kZWxOYW1lfWAsIHtcbiAgICAgICAgdmFsdWU6IGAke2FwaS51cmx9JHttb2RlbC5tb2RlbE5hbWV9L3ByZWRpY3RgLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIlJlc3RBcGlVcmxcIiwge1xuICAgICAgdmFsdWU6IGFwaS51cmwsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==