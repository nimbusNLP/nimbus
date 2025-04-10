import { select, note } from "@clack/prompts";
import { readModelsConfig } from "./fileSystem.js";
import { optionToExitApp } from './validation.js'

export async function shouldDeployModel(): Promise<boolean> {
  const deployModelChoice = await select({
    message: "Are you ready to deploy a model?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  });
  
  optionToExitApp(deployModelChoice)

  if (deployModelChoice === "no") {
    console.log("No model deployed.");
    process.exit(0);
  }

  return deployModelChoice === "yes";
}
export async function shouldRemoveModel(modelName: string): Promise<void> {
  const removeModelChoice = await select({
    message: `Are you sure you want to remove the model "${modelName}"? This will delete its cloud resources.`,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  });
  
  optionToExitApp(removeModelChoice)

  if (removeModelChoice === "no") {
    console.log("No model removed.");
    process.exit(0);
  }
}

export async function selectModelToRemove(
  modelsConfigPath: string,
): Promise<string | null> {
  const models = readModelsConfig(modelsConfigPath);

  if (models.length === 0) {
    note("No models found in configuration to remove.", "Error");
    process.exit(0);
  }

  const options = models.map((model) => ({
    value: model.modelName,
    label: `${model.modelName} (${model.modelType})`,
    hint:
      model.description ||
      (model.modelType === "pre-trained"
        ? model.modelPathOrName
        : "Fine-tuned model"),
  }));

  const selectedModel = await select({
    message: "Which model would you like to remove?",
    options: options,
  });

  optionToExitApp(selectedModel)

  return selectedModel as string;
}

export async function shouldDestroyStack(): Promise<void> {
  const destroyChoice = await select({
    message: `Are you sure you want to destroy the stack? This will delete all deployed AWS resources.`,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
  });

  optionToExitApp(destroyChoice)

  if (destroyChoice === "no") {
    console.log("Stack not destroyed.");
    process.exit(0);
  }
}