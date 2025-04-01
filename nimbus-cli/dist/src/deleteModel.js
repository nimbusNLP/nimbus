import path from "path";
import { displayDeleteCompletionMessage, displayDeleteWelcomeMessage, } from "./utils/ui.js";
import { deleteModelFromStack } from "./utils/deployment.js";
import { shouldRemoveModel, selectModelToRemove } from "./utils/cli.js";
import { removeModelFromConfig, removeModelDirectory, } from "./utils/fileSystem.js";
export async function deleteModel() {
    displayDeleteWelcomeMessage();
    const currentDir = process.cwd();
    const finishedDir = path.join(currentDir, "finished_dir");
    const modelsConfigPath = path.join(finishedDir, "models.json");
    await shouldRemoveModel();
    const modelToRemove = await selectModelToRemove(modelsConfigPath);
    if (modelToRemove) {
        removeModelFromConfig(modelsConfigPath, modelToRemove);
        removeModelDirectory(finishedDir, modelToRemove);
    }
    await deleteModelFromStack(currentDir, modelToRemove);
    displayDeleteCompletionMessage();
}
