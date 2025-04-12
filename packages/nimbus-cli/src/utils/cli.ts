import { select, note } from "@clack/prompts";
import { readModelsConfig } from "./fileSystem.js";
import { optionToExitApp } from './validation.js';
import { displayDeleteModelInterface } from './coloredOutput.js';
import path from 'path';
import chalk from "chalk";

export async function shouldDeployModel(): Promise<boolean> {
  const deployModelChoice = await select({
    message: chalk.cyan.bold("Are you ready to deploy a model?"),
    options: [
      { value: "yes", label: chalk.white("Yes") },
      { value: "no", label: chalk.white("No") },
    ],
  });
  
  optionToExitApp(deployModelChoice)

  if (deployModelChoice === "no") {
    console.log(chalk.yellow("No model deployed."));
    process.exit(0);
  }

  return deployModelChoice === "yes";
}

export async function shouldRemoveModel(modelName: string): Promise<void> {

  const finishedDir = path.join(process.cwd(), "../nimbus-cli/finished_dir");
  const modelsConfigPath = path.join(finishedDir, "models.json");
  
  let modelToDelete = null;
  try {
    const models = readModelsConfig(modelsConfigPath);
    modelToDelete = models.find(model => model.modelName === modelName);
  } catch (error) {
    console.log('');
  }
  
  if (modelToDelete) {
    displayDeleteModelInterface(
      modelToDelete.modelName,
      modelToDelete.modelType,
      modelToDelete.description || "No description available",
      true 
    );
  }
  
  const removeModelChoice = await select({
    message: `Are you sure you want to remove this model? This will delete all cloud resources.`,
    options: [
      { value: "yes", label: chalk.white("Yes, delete it") },
      { value: "no", label: chalk.white("No, cancel deletion") },
    ],
  });
  
  optionToExitApp(removeModelChoice)

  if (removeModelChoice === "no") {
    console.log("Model deletion cancelled.");
    process.exit(0);
  }
}

export async function selectModelToRemove(
  modelsConfigPath: string,
): Promise<string | null> {
  let models = [];
  
  try {
    models = readModelsConfig(modelsConfigPath);
  } catch (error) {
    console.error(chalk.yellow(`Warning: Could not read models from ${modelsConfigPath}`));
    return null;
  }

  if (models.length === 0) {
    return null;
  }

  const options = models.map((model) => ({
    value: model.modelName,
    label: chalk.white(`${model.modelName} (${model.modelType})`),
    hint:
      model.description ||
      (model.modelType === "pre-trained"
        ? model.modelPathOrName
        : "Fine-tuned model"),
  }));

  const selectedModel = await select({
    message: "Which model would you like to remove?",
    options,
  });

  optionToExitApp(selectedModel);

  if (selectedModel) {
    const modelToDelete = models.find(model => model.modelName === selectedModel);
    if (modelToDelete) {
      displayDeleteModelInterface(
        modelToDelete.modelName,
        modelToDelete.modelType,
        modelToDelete.description || "No description available"
      );
    }
  }

  return selectedModel as string;
}

export async function shouldDestroyStack(): Promise<void> {
  note(chalk.red.bold("This will destroy all deployed models and infrastructure!"), "WARNING!!");

  const destroyChoice = await select({
    message: chalk.red.bold("Are you sure you want to destroy the entire stack?"),
    options: [
      { value: "yes", label: chalk.white("Yes, destroy everything") },
      { value: "no", label: chalk.white("No, cancel") },
    ],
  });
  
  optionToExitApp(destroyChoice)

  if (destroyChoice === "no") {
    console.log(chalk.green("Stack not destroyed."));
    process.exit(0);
  }
}