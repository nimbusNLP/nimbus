import path from "path";
import { fileURLToPath } from "url";
import {
  displayDeleteCompletionMessage,
  displayDeleteWelcomeMessage,
} from "./utils/ui.js";
import { deleteModelFromStack } from "./utils/deployment.js";
import { shouldRemoveModel, selectModelToRemove } from "./utils/cli.js";
import {
  readModelsConfig,
} from "./utils/fileSystem.js";
import * as fs from 'fs';
import { 
  displayNoModelsToDelete, 
  displayNoModelSelected, 
  displayRemovingModel
} from "./utils/coloredOutput.js";

export async function deleteModel(nimbusLocalStoragePath: string) {
  const __filename = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(__filename);
  const finishedDir = path.join(nimbusLocalStoragePath, "finished_dir");
  
  if (!fs.existsSync(finishedDir)) {
    displayNoModelsToDelete();
    return;
  }

  const modelsConfigPath = path.join(finishedDir, "models.json");
  const models = readModelsConfig(modelsConfigPath);
  
  if (models.length === 0) {
    displayNoModelsToDelete();
    return;
  }

  displayDeleteWelcomeMessage();

  const modelToRemove = await selectModelToRemove(modelsConfigPath);

  if (modelToRemove) {
    await shouldRemoveModel(modelToRemove, modelsConfigPath);
    displayRemovingModel(modelToRemove);
    await deleteModelFromStack(currentDir, finishedDir, modelToRemove);
    displayDeleteCompletionMessage();
  } else {
    displayNoModelSelected();
  }
}
