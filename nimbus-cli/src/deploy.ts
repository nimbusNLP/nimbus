import path from "path";
import { displayWelcomeMessage, displayCompletionMessage } from "./utils/ui.js";
import { deployApiGateway, deployUpdatedStack } from "./utils/deployment.js";
import { shouldDeployApiGateway, shouldDeployModel } from "./utils/cli.js";
import {
  getModelType,
  getModelName,
  getPreTrainedModel,
  getFineTunedModelPath,
  generateModelFiles,
  getModelDescription,
} from "./utils/model.js";
import {
  ensureDirectoryExists,
  initializeModelsConfig,
  readModelsConfig,
  updateModelsConfig,
  copyModelDirectory,
} from "./utils/fileSystem.js";

export async function deploy(nimbusLocalStoragePath: string) {
  displayWelcomeMessage();

  const currentDir = process.cwd();
  const finishedDir = path.join(nimbusLocalStoragePath, "finished_dir");
  const modelsConfigPath = path.join(finishedDir, "models.json");

  ensureDirectoryExists(nimbusLocalStoragePath);
  ensureDirectoryExists(finishedDir);
  initializeModelsConfig(modelsConfigPath);

  // Check if we need to deploy API Gateway
  let deployApi = false;
  if (readModelsConfig(modelsConfigPath).length === 0) {
    deployApi = await shouldDeployApiGateway();
  }

  if (deployApi) {
    await deployApiGateway(currentDir, finishedDir);
  }

  // Check if user wants to deploy a model
  if (!(await shouldDeployModel())) {
    return;
  }

  // Get model details
  const modelType = await getModelType();
  const modelName = await getModelName(modelsConfigPath);
  const modelDescription = (await getModelDescription()) ?? "";
  const modelPathOrName =
    modelType === "pre-trained"
      ? await getPreTrainedModel()
      : await getFineTunedModelPath();


  // Create model directory and copy files if needed
  const modelDir = path.join(finishedDir, modelName);
  ensureDirectoryExists(modelDir);
  
  let isCancelled = false;

  process.once("SIGINT", () => {
    isCancelled = true;
    console.log("\n❌ Deployment cancelled by user.");
    process.exit(0);
  });

  if (modelType === "fine-tuned") {
    const destination = path.join(modelDir, "model-best");
    copyModelDirectory(modelPathOrName, destination);
  }

  // Generate and write model files
  generateModelFiles(modelType, modelPathOrName, modelDir, modelDescription);

  // Update models configuration
  updateModelsConfig(modelsConfigPath, {
    modelName,
    modelType,
    modelPathOrName,
    description: modelDescription,
  });

  // Deploy the updated stack
  await deployUpdatedStack(currentDir, finishedDir, modelName, modelDir);
  
  displayCompletionMessage();
}
