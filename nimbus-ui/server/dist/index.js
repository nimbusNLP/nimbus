"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveUi = serveUi;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Export the function so it can be imported and called by nimbus-cli
function serveUi(nimbusLocalStoragePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        // Restore JSON Middleware
        app.use(express_1.default.json());
        // Use environment variable for port, defaulting to 3001
        const port = process.env.PORT || 3001;
        // Paths required for the API route
        const finishedDirPath = path_1.default.join(nimbusLocalStoragePath, 'finished_dir');
        const modelsConfigPath = path_1.default.join(finishedDirPath, 'models.json');
        const cdkOutputsPath = path_1.default.join(__dirname, '..', '..', '..', 'nimbus-cdk', 'outputs.json');
        // Restore API Route
        app.get('/api/models', (req, res) => {
            try {
                // Check for models config file
                if (!fs_1.default.existsSync(modelsConfigPath)) {
                    console.warn(`Models config not found at ${modelsConfigPath}`);
                    res.json([]); // Return empty if not found
                    return;
                }
                // Check for CDK outputs file
                if (!fs_1.default.existsSync(cdkOutputsPath)) {
                    console.error(`CDK outputs not found at ${cdkOutputsPath}. Run 'nimbus deploy' first.`);
                    res.status(404).json({ error: 'Deployment outputs not found. Have you deployed?' });
                    return;
                }
                // Read and parse files
                const models = JSON.parse(fs_1.default.readFileSync(modelsConfigPath, 'utf8'));
                const cdkOutputs = JSON.parse(fs_1.default.readFileSync(cdkOutputsPath, 'utf8'));
                // Find the API Gateway URL from outputs
                const apiGatewayOutput = Object.values(cdkOutputs).find((stack) => stack.RestApiUrl);
                const baseUrl = apiGatewayOutput === null || apiGatewayOutput === void 0 ? void 0 : apiGatewayOutput.RestApiUrl;
                if (!baseUrl) {
                    console.error('API Gateway URL not found in CDK outputs. Have you deployed successfully?');
                    res.status(404).json({ error: 'API Gateway URL not found. Have you deployed successfully?' });
                    return;
                }
                // Map models to include their full prediction endpoint
                const modelsWithEndpoints = models.map((model) => {
                    const endpoint = `${baseUrl}${model.modelName}/predict`; // Assumes 'prod' stage
                    return Object.assign(Object.assign({}, model), { endpoint });
                });
                res.json(modelsWithEndpoints); // Send the combined data
            }
            catch (error) {
                console.error('Error fetching models:', error);
                res.status(500).json({ error: 'Failed to fetch models' }); // Handle errors during processing
            }
        });
        // Calculate path to the frontend build directory
        const clientBuildPath = path_1.default.join(__dirname, '..', '..', 'client', 'dist');
        // Restore Static Serving and Catch-all Logic
        if (fs_1.default.existsSync(clientBuildPath)) {
            // Serve static files (HTML, JS, CSS) from the client build directory
            app.use(express_1.default.static(clientBuildPath));
            // Catch-all route: For any GET request that doesn't match '/api/models' or a static file,
            // serve the main index.html file. This is crucial for client-side routing (e.g., React Router).
            app.get(/^\/(?!api).*/, (req, res) => {
                res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
            });
        }
        else {
            // Handle case where the frontend hasn't been built
            console.error(`Frontend build directory not found at ${clientBuildPath}`);
            console.error('Have you run "npm run build -w nimbus-ui-client"?');
            // Provide a fallback for GET requests if frontend isn't available
            app.get(/^\/(?!api).*/, (req, res) => {
                res.status(404).send('Frontend not available. Please build the client application.');
            });
        }
        // Start the server
        app.listen(port, () => {
            console.log(`[server]: Nimbus UI server listening at http://localhost:${port}`);
        });
    });
}
