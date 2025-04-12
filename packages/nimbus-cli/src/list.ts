import path from "path";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { displayModelList } from "./utils/coloredOutput.js";
import { readModelsConfig } from "./utils/fileSystem.js"

export interface ModelDataType {
  modelName: string;
  modelType: string;
  modelPathOrName: string;
  description: string;
}

export function listModels(nimbusLocalStoragePath: string) {
  const finishedDir = path.join(nimbusLocalStoragePath, "finished_dir");
  const modelsConfigPath = path.join(finishedDir, "models.json");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dotEnvFilePath = path.join(__dirname, '..', '..', '.env');
  
  dotenv.config({path: dotEnvFilePath});

  const apiGatewayBaseUrl = process.env.API_GATEWAY_URL;
  const nimbusApiKey = process.env.API_KEY;

  try {
    const models = readModelsConfig(modelsConfigPath)
    displayModelList(models, apiGatewayBaseUrl, nimbusApiKey)
  } catch (error) {
      displayModelList([]);
  }
}
