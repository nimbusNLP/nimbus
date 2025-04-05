import path from "path";
import { displayWelcomeMessage, displayCompletionMessage } from "./utils/ui.js";
import { deployUpdatedStack } from "./utils/deployment.js";
import { shouldDeployModel } from "./utils/cli.js";
import { getModelType, getModelName, getPreTrainedModel, getFineTunedModelPath, generateModelFiles, getModelDescription, } from "./utils/model.js";
import { ensureDirectoryExists, initializeModelsConfig, updateModelsConfig, copyModelDirectory, } from "./utils/fileSystem.js";
export async function deploy(nimbusLocalStoragePath) {
    displayWelcomeMessage();
    const currentDir = process.cwd();
    const finishedDir = path.join(nimbusLocalStoragePath, "finished_dir");
    const modelsConfigPath = path.join(finishedDir, "models.json");
    ensureDirectoryExists(nimbusLocalStoragePath);
    ensureDirectoryExists(finishedDir);
    initializeModelsConfig(modelsConfigPath);
    // Check if user wants to deploy a model
    if (!(await shouldDeployModel())) {
        return;
    }
    // Get model details
    const modelType = await getModelType();
    const modelName = await getModelName(modelsConfigPath);
    const modelDescription = (await getModelDescription()) ?? "";
    const modelPathOrName = modelType === "pre-trained"
        ? await getPreTrainedModel()
        : await getFineTunedModelPath();
    // Create model directory and copy files if needed
    const modelDir = path.join(finishedDir, modelName);
    ensureDirectoryExists(modelDir);
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
    await deployUpdatedStack(currentDir, finishedDir, modelName, modelDir);
    displayCompletionMessage();
}
