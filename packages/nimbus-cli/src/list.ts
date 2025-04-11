import path from "path";
import fs from "fs";
import { displayModelList } from "./utils/coloredOutput.js";
import chalk from "chalk";
import { fetchApiKey } from "./utils/deployment.js";

export interface ModelDataType {
  modelName: string;
  modelType: string;
  modelPathOrName: string;
  description: string;
}

export function listModels(nimbusLocalStoragePath: string) {
  const finishedDir = path.join(nimbusLocalStoragePath, "finished_dir");
  const modelsConfigPath = path.join(finishedDir, "models.json");

  try {
    const data = fs.readFileSync(modelsConfigPath, "utf8");
    const json: ModelDataType[] = JSON.parse(data);

    let baseUrl: string | undefined;
    let apiKeyId: string | undefined;
    

    try {
      const cdkDir = path.join(process.cwd(), "../nimbus-cdk");
      const outputsPath = path.join(cdkDir, "outputs.json");
      
      if (fs.existsSync(outputsPath)) {
        const outputsData = fs.readFileSync(outputsPath, "utf8");
        const outputs = JSON.parse(outputsData);
        
        if (outputs.ApiGatewayStack && outputs.ApiGatewayStack.RestApiUrl) {
          baseUrl = outputs.ApiGatewayStack.RestApiUrl;
        }
        
        if (outputs.ApiGatewayStack && outputs.ApiGatewayStack.ApiKeyId) {
          apiKeyId = outputs.ApiGatewayStack.ApiKeyId;
          

          fetchApiKey(apiKeyId)
            .then(apiKey => {
              displayModelList(json, baseUrl, apiKey);
            })
            .catch(error => {
              console.error(chalk.yellow(`Warning: Could not fetch API key: ${error.message}`));
              displayModelList(json, baseUrl);
            });
          
          return; 
        }
      }
    } catch (error) {
      console.error(chalk.yellow(`Warning: Could not read outputs.json: ${error.message}`));
    }

   
    displayModelList(json, baseUrl);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      displayModelList([]);
    } else {
      console.error(chalk.red(`Error reading models configuration: ${error}`));
    }
  }
}
