import express from 'express';
import path from 'path';
import fs from 'fs';
import open from 'open';
// Export the function so it can be imported and called by nimbus-cli
export async function serveUi(nimbusLocalStoragePath) {
    const app = express();
    // Restore JSON Middleware
    app.use(express.json());
    // Use environment variable for port, defaulting to 3001
    const port = process.env.PORT || 3001;
    // Paths required for the API route
    const finishedDirPath = path.join(nimbusLocalStoragePath, 'finished_dir');
    const modelsConfigPath = path.join(finishedDirPath, 'models.json');
    // Use import.meta.url for file paths in ES Modules
    const __filename = new URL(import.meta.url).pathname;
    const __dirname = path.dirname(__filename);
    const cdkOutputsPath = path.join(__dirname, '..', '..', '..', 'nimbus-cdk', 'outputs.json');
    // Restore API Route
    app.get('/api/models', (req, res) => {
        try {
            // Check for models config file
            if (!fs.existsSync(modelsConfigPath)) {
                console.warn(`Models config not found at ${modelsConfigPath}`);
                res.json([]); // Return empty if not found
                return;
            }
            // Check for CDK outputs file
            if (!fs.existsSync(cdkOutputsPath)) {
                console.error(`CDK outputs not found at ${cdkOutputsPath}. Run 'nimbus deploy' first.`);
                res.status(404).json({ error: 'Deployment outputs not found. Have you deployed?' });
                return;
            }
            // Read and parse files
            const models = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));
            const cdkOutputs = JSON.parse(fs.readFileSync(cdkOutputsPath, 'utf8'));
            // Find the API Gateway URL from outputs
            const apiGatewayOutput = Object.values(cdkOutputs).find((stack) => stack.RestApiUrl);
            const baseUrl = apiGatewayOutput?.RestApiUrl;
            if (!baseUrl) {
                console.error('API Gateway URL not found in CDK outputs. Have you deployed successfully?');
                res.status(404).json({ error: 'API Gateway URL not found. Have you deployed successfully?' });
                return;
            }
            // Map models to include their full prediction endpoint
            const modelsWithEndpoints = models.map((model) => {
                const endpoint = `${baseUrl}${model.modelName}/predict`; // Assumes 'prod' stage
                return {
                    ...model,
                    endpoint,
                };
            });
            res.json(modelsWithEndpoints); // Send the combined data
        }
        catch (error) {
            console.error('Error fetching models:', error);
            res.status(500).json({ error: 'Failed to fetch models' }); // Handle errors during processing
        }
    });
    // Calculate path to the frontend build directory
    const clientBuildPath = path.join(__dirname, '..', '..', 'client', 'dist');
    // Restore Static Serving and Catch-all Logic
    if (fs.existsSync(clientBuildPath)) {
        // Serve static files (HTML, JS, CSS) from the client build directory
        app.use(express.static(clientBuildPath));
        // Catch-all route: For any GET request that doesn't match '/api/models' or a static file,
        // serve the main index.html file. This is crucial for client-side routing (e.g., React Router).
        app.get(/^\/(?!api).*/, (req, res) => {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
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
        open(`http://localhost:${port}`);
    });
}
