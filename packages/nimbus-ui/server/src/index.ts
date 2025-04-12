import express, { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import open from 'open';
import axios from 'axios';


export async function serveUi(nimbusLocalStoragePath: string, apiGatewayBaseUrl: string, nimbusApiKey: string) {
  const port = 3001;
  const app = express();
  app.use(express.json());

  const finishedDirPath = path.join(nimbusLocalStoragePath, 'finished_dir');
  const modelsConfigPath = path.join(finishedDirPath, 'models.json');
  const cdkOutputsPath = path.join(process.cwd(), '..', 'nimbus-cdk', 'outputs.json');

  app.get('/api/models', (req: Request, res: Response) => {
    try {
      // Check for models config file
      if (!fs.existsSync(modelsConfigPath)) {
        console.warn(`Models config not found at ${modelsConfigPath}`);
        res.json([]); 
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
      const apiGatewayOutput = Object.values(cdkOutputs).find((stack: any) => stack.RestApiUrl) as any;
      const baseUrl = apiGatewayOutput?.RestApiUrl;

      if (!baseUrl) {
        console.error('API Gateway URL not found in CDK outputs. Have you deployed successfully?');
        res.status(404).json({ error: 'API Gateway URL not found. Have you deployed successfully?' });
        return;
      }

      // Map models to include their full prediction endpoint
      const modelsWithEndpoints = models.map((model: any) => {
        const endpoint = `${baseUrl}${model.modelName}/predict`; // Assumes 'prod' stage
        return {
          ...model,
          endpoint,
        };
      })

      res.json(modelsWithEndpoints); // Send the combined data

    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: 'Failed to fetch models' }); // Handle errors during processing
    }
  });

  app.post('/api/predict/:modelName', async (req: Request, res: Response) => {
    const { modelName } = req.params;
    const { text } = req.body;
    const endpoint = `${apiGatewayBaseUrl}/${modelName}/predict`;
    const response = await axios.post(endpoint, { text }, {
      headers: {
        'x-api-key': nimbusApiKey,
      },
    });

    res.json(response.data);
  });

  // Calculate path to the frontend build directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientBuildPath = path.join(__dirname, 'frontend');

  // Restore Static Serving and Catch-all Logic
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));

    app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
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