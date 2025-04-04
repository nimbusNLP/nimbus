import path from "path";
import { displayDeleteCompletionMessage, displayDeleteWelcomeMessage, } from "./utils/ui.js";
import { deleteModelFromStack } from "./utils/deployment.js";
import { shouldRemoveModel, selectModelToRemove } from "./utils/cli.js";
import { removeModelFromConfig, removeModelDirectory, readModelsConfig, } from "./utils/fileSystem.js";
import * as fs from 'fs';
export async function deleteModel(nimbusLocalStoragePath) {
    displayDeleteWelcomeMessage();
    const currentDir = process.cwd();
    const finishedDir = path.join(nimbusLocalStoragePath, "finished_dir");
    if (!fs.existsSync(finishedDir)) {
        console.log("No models found to delete.");
        return;
    }
    const modelsConfigPath = path.join(finishedDir, "models.json");
    const models = readModelsConfig(modelsConfigPath);
    if (models.length === 0) {
        console.log("No models found to delete.");
        return;
    }
    const modelToRemove = await selectModelToRemove(modelsConfigPath);
    if (modelToRemove) {
        await shouldRemoveModel(modelToRemove);
        console.log(`Proceeding to remove model: ${modelToRemove}`);
        removeModelFromConfig(modelsConfigPath, modelToRemove);
        removeModelDirectory(finishedDir, modelToRemove);
        await deleteModelFromStack(currentDir, finishedDir, modelToRemove);
        displayDeleteCompletionMessage();
    }
    else {
        console.log("No model selected for deletion.");
    }
}
