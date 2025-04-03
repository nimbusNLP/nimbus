import express from 'express';
import path from 'path';
import fs from 'fs';

export async function serveUi(nimbusLocalStoragePath: string) {
const app = express();

  app.use(express.json());

  const port = 3000; // Potential todo: make this configurable

  const finishedDirPath = path.join(nimbusLocalStoragePath, 'finished_dir');
  const modelsConfigPath = path.join(finishedDirPath, 'models.json');
  const cdkOutputsPath = path.join(process.cwd(), 'nimbus-cdk/outputs.json');

  app.get('/api/models', (req: express.Request, res: express.Response) => {
    try {
      if (!fs.existsSync(modelsConfigPath)) {
        console.warn(`Models config not found at ${modelsConfigPath}`);
        return res.json([]);
      }

      if (!fs.existsSync(cdkOutputsPath)) {
        console.error(`CDK outputs not found at ${cdkOutputsPath}. Run 'nimbus deploy' first.`);
        return res.status(404).json({ error: 'Deployment outputs not found. Have you deployed?' });
      }

      const models = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));
      const cdkOutputs = JSON.parse(fs.readFileSync(cdkOutputsPath, 'utf8'));

      const apiGatewayOutput = Object.values(cdkOutputs).find((stack: any) => stack.RestApiUrl) as any;
      const baseUrl = apiGatewayOutput?.RestApiUrl;

      if (!baseUrl) {
        console.error('API Gateway URL not found. Have you deployed?');
        return res.status(404).json({ error: 'API Gateway URL not found. Have you deployed?' });
      }

      const modelsWithEndpoints = models.map((model: any) => {
        const endpoint = `${baseUrl}/prod/${model.modelName}/predict`;
        return {
          ...model,
          endpoint,
        };
      })

      res.json(modelsWithEndpoints);
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  });


  app.listen(port, () => {
    console.log(`Nimbus UI server listening at http://localhost:${port}`);
  });
}