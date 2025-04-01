import { select, isCancel, cancel, note, confirm } from '@clack/prompts';
import { readModelsConfig } from './fileSystem.js';
import path from 'path';
export async function shouldDeployApiGateway(): Promise<boolean> {
  const deployChoice = await select({
    message: 'Do you want to deploy the API Gateway?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
  });

  if (isCancel(deployChoice)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  return deployChoice === 'yes';
}

// Select model to deploy
export async function shouldDeployModel(): Promise<boolean> {
  const deployModelChoice = await select({
    message: 'Are you ready to deploy a model?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
  });

  if (isCancel(deployModelChoice)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  return deployModelChoice === 'yes';
} 

export async function shouldRemoveModel(): Promise<boolean> {
  const removeModelChoice = await select({
    message: 'Would you like to remove a model?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
  });

  if (isCancel(removeModelChoice)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  return removeModelChoice === 'yes';
}
  
// Select model to remove
export async function selectModelToRemove(modelsConfigPath: string): Promise<string | null | symbol> {
  const models = readModelsConfig(modelsConfigPath);

  if (models.length === 0) {
    note('No models found in configuration to remove.');
    return null;
  }

  const options = models.map(model => ({
    value: model.modelName,
    label: `${model.modelName} (${model.modelType})`,
    hint: model.description || (model.modelType === 'pre-trained' ? model.modelPathOrName : 'Fine-tuned model')
  }));

  const selectedModel = await select({
    message: 'Which model would you like to remove?',
    options: options,
  });

  if (isCancel(selectedModel)) {
     return selectedModel; // Propagate cancellation
  }
  
  const shouldRemove = await confirm({
      message: `Are you sure you want to remove the model "${selectedModel}"? This will delete its cloud resources.`,
  });

  if (isCancel(shouldRemove) || !shouldRemove) {
    cancel('Model removal cancelled.');
    process.exit(0);
  }

  return selectedModel as string;
}

// Confirm directory removal
export async function confirmDirectoryRemoval(modelName: string): Promise<boolean | symbol> {
  const shouldDeleteDir = await confirm({
      message: `Also remove the local artifact directory "finished_dir/${modelName}"?`,
      initialValue: true // Default to yes
  });

   if (isCancel(shouldDeleteDir)) {
       return shouldDeleteDir; // Propagate cancellation
   }
  return shouldDeleteDir;
}
