import path from 'path';
import { displayWelcomeMessage, displayCompletionMessage } from './utils/ui.js';
import { deployApiGateway, deployUpdatedStack } from './utils/deployment.js';
import { shouldDeployApiGateway, shouldDeployModel, shouldRemoveModel, selectModelToRemove, confirmDirectoryRemoval } from './utils/cli.js';
import { getModelType, getModelName, getPreTrainedModel, getFineTunedModelPath, generateModelFiles, getModelDescription } from './utils/model.js';
import { 
  ensureDirectoryExists, 
  initializeModelsConfig, 
  readModelsConfig, 
  updateModelsConfig, 
  removeModelFromConfig,
  removeModelDirectory,
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

  // Variables to track actions
  let deployingModel = false;
  let modelName = '';
  let removedModel = false;

  // Ask if user wants to deploy a model
  const shouldDeploy = await shouldDeployModel();
  
  // Handle model deployment if requested
  if (shouldDeploy) {
    deployingModel = true;
    
    // Get model details
    const modelType = await getModelType();
    modelName = await getModelName();
    const modelDescription = await getModelDescription();
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
    generateModelFiles(modelType, modelPathOrName, modelDir, modelDescription);

    // Update models configuration
    updateModelsConfig(modelsConfigPath, { 
      modelName, 
      modelType, 
      modelPathOrName,
      description: modelDescription 
    });
  }

  // Ask if user wants to remove a model
  const removeModel = await shouldRemoveModel();
  
  // Handle model removal if requested
  if (removeModel) {
    const modelToRemove = await selectModelToRemove(modelsConfigPath);
    if (modelToRemove && typeof modelToRemove === 'string') {
      // Remove model from config
      removeModelFromConfig(modelsConfigPath, modelToRemove);
      
      // Ask if physical directory should be removed
      const shouldDeleteDir = await confirmDirectoryRemoval(modelToRemove);
      if (shouldDeleteDir === true) {
        removeModelDirectory(finishedDir, modelToRemove);
      }
      
      removedModel = true;
    }
  }

  // Deploy the updated stack if any changes were made
  if (deployingModel || removedModel) {
    if (removedModel) {
      await deployUpdatedStack(currentDir, "");
    } else {
      await deployUpdatedStack(currentDir, modelName);
    }
  }
  
  displayCompletionMessage();
}

await main();