import fs from 'fs';
import path from 'path';
import open from 'open';
import axios from 'axios';
import { fileURLToPath } from 'url';
import express, { Request, Response } from 'express';


export async function serveUi(nimbusLocalStoragePath: string, apiGatewayBaseUrl: string, nimbusApiKey: string) {
  const port = 3001;
  const app = express();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientBuildPath = path.join(__dirname, 'frontend');
  const finishedDirPath = path.join(nimbusLocalStoragePath, 'finished_dir');
  const modelsConfigPath = path.join(finishedDirPath, 'models.json');
  
  app.use(express.json());
  app.use(express.static(clientBuildPath));

  app.get('/api/models', (req: Request, res: Response) => {
    try {
      if (!fs.existsSync(modelsConfigPath)) {
        res.json([]); 
        return;
      }
      const models = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));

      const modelsWithEndpoints = models.map((model: any) => {
        const endpoint = `${apiGatewayBaseUrl}${model.modelName}/predict`; 
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

  app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
 
  app.listen(port, () => {
    console.log(`[server]: Nimbus UI server listening at http://localhost:${port}`);
    open(`http://localhost:${port}`);
  });
}