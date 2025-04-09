import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import open from 'open';
import axios from 'axios';

// Export the function so it can be imported and called by nimbus-cli
export async function serveUi(nimbusLocalStoragePath: string) {
  const app = express();

  // Restore JSON Middleware
  app.use(express.json());

  // Use environment variable for port, defaulting to 3001
  const port = process.env.PORT || 3001;

  // Get API Gateway details from environment variables
  const apiGatewayBaseUrl = process.env.NIMBUS_API_GATEWAY_URL;
  const apiKey = process.env.NIMBUS_API_KEY;

  if (!apiGatewayBaseUrl || !apiKey) {
    console.error('Error: NIMBUS_API_GATEWAY_URL and NIMBUS_API_KEY environment variables must be set.');
    process.exit(1); // Exit if essential config is missing
  }

  // Paths required for the API route
  const finishedDirPath = path.join(nimbusLocalStoragePath, 'finished_dir');
  const modelsConfigPath = path.join(finishedDirPath, 'models.json');
  const cdkOutputsPath = path.join(process.cwd(), '..', 'nimbus-cdk', 'outputs.json');

  // --- Rewritten API Route for Listing Models --- 
  app.get('/api/models', async (req: Request, res: Response) => {
    try {
      console.log(`Proxying GET request to: ${apiGatewayBaseUrl}/`);
      const response = await axios.get(`${apiGatewayBaseUrl}/`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      console.log('API Gateway response status (models):', response.status);
      res.json(response.data); // Forward the response from API Gateway
    } catch (error: any) {
      console.error('Error proxying /api/models:', error.response?.status, error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch models from API Gateway',
        details: error.response?.data || error.message 
      });
    }
  });

  // --- New API Route for Proxying Predictions ---
  app.post('/api/predict/:modelName', async (req: Request, res: Response) => {
    const { modelName } = req.params;
    const predictUrl = `${apiGatewayBaseUrl}/${modelName}/predict`;
    
    try {
      console.log(`Proxying POST request to: ${predictUrl}`);
      const response = await axios.post(predictUrl, req.body, { // Forward the request body
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json', // Ensure correct content type
        },
      });
      console.log(`API Gateway response status (${modelName}/predict):`, response.status);
      res.json(response.data); // Forward the response from API Gateway
    } catch (error: any) {
      console.error(`Error proxying /api/predict/${modelName}:`, error.response?.status, error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ 
        error: `Failed to get prediction for model ${modelName}`,
        details: error.response?.data || error.message
      });
    }
  });

  // Calculate path to the frontend build directory
  const clientBuildPath = path.join(process.cwd(), '..', 'nimbus-ui', 'client', 'dist');
  console.log(clientBuildPath);

  // Restore Static Serving and Catch-all Logic
  if (fs.existsSync(clientBuildPath)) {
    // Serve static files (HTML, JS, CSS) from the client build directory
    app.use(express.static(clientBuildPath));

    // Catch-all route: For any GET request that doesn't match '/api/models' or a static file,
    // serve the main index.html file. This is crucial for client-side routing (e.g., React Router).
    app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    // Handle case where the frontend hasn't been built
    console.error(`Frontend build directory not found at ${clientBuildPath}`);
    console.error('Have you run "npm run build -w nimbus-ui-client"?');
    // Provide a fallback for GET requests if frontend isn't available
    app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
       res.status(404).send('Frontend not available. Please build the client application.');
    });
  }

  // Start the server
  app.listen(port, () => {
    console.log(`[server]: Nimbus UI server listening at http://localhost:${port}`);
    open(`http://localhost:${port}`);
  });
}
