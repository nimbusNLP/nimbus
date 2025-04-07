import path from "path";
import fs from "fs";

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

    if (json.length === 0) {
      console.log("No models deployed yet.");
      return;
    }

    const urlDir = path.join(process.cwd(), "../nimbus-cdk/outputs.json");
    const urlData = fs.readFileSync(urlDir, "utf8");
    const urlJson: string = JSON.parse(urlData).ApiGatewayStack.RestApiUrl;

    console.log("\nDeployed Models:");
    console.log("---------------");
    json.forEach((modelData) => {
      console.log(
        `- ${modelData.modelName} (${modelData.modelType}) - ${urlJson}${modelData.modelName}/predict`
      );
      console.log(`  Description: ${modelData.description}`);
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log(
        'No models deployed yet. Use "nimbus deploy" to deploy your first model.'
      );
    } else {
      console.error("❌  Error reading models configuration:", error);
    }
  }
}
