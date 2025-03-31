import path from 'path';
import { displayWelcomeMessage, displayCompletionMessage } from './utils/ui.js';
import { deployApiGateway, deployUpdatedStack } from './utils/deployment.js';
import { shouldDeployApiGateway, shouldDeployModel } from './utils/cli.js';
import { getModelType, getModelName, getPreTrainedModel, getFineTunedModelPath, generateModelFiles } from './utils/model.js';
import { 
  ensureDirectoryExists, 
  initializeModelsConfig, 
  readModelsConfig, 
  updateModelsConfig, 
  copyModelDirectory 
} from './utils/fileSystem.js';

async function main() {
  displayWelcomeMessage();

  const currentDir = process.cwd();
  const finishedDir = path.join(currentDir, 'finished_dir');
  const modelsConfigPath = path.join(finishedDir, 'models.json');

  ensureDirectoryExists(finishedDir);
  initializeModelsConfig(modelsConfigPath);

  // Check if we need to deploy API Gateway
  let deployApi = false;
  if (readModelsConfig(modelsConfigPath).length === 0) {
    deployApi = await shouldDeployApiGateway();
  }

  if (deployApi) {
    await deployApiGateway(currentDir);
  }

  // Check if user wants to deploy a model
  if (!await shouldDeployModel()) {
    return;
  }

  // Get model details
  const modelType = await getModelType();
  const modelName = await getModelName();
  const modelPathOrName = modelType === 'pre-trained' 
    ? await getPreTrainedModel()
    : await getFineTunedModelPath();

  // Create model directory and copy files if needed
  const modelDir = path.join(finishedDir, modelName);
  ensureDirectoryExists(modelDir);

  if (modelType === 'fine-tuned') {
    const destination = path.join(modelDir, 'model-best');
    copyModelDirectory(modelPathOrName, destination);
  }

  // Generate and write model files
  generateModelFiles(modelType, modelPathOrName, modelDir);

  // Update models configuration
  updateModelsConfig(modelsConfigPath, { modelName, modelType, modelPathOrName });

  // Deploy the updated stack
  await deployUpdatedStack(currentDir);
  displayCompletionMessage();
}

await main();