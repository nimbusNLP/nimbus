import { select, text, isCancel, cancel } from '@clack/prompts';
import fs from 'fs';
import path from 'path';
import { ModelConfig } from './fileSystem.js';
import { writeModelFiles } from './fileSystem.js';
import generateDockerfile from '../dockerCode.js';
import generateLambdaFile from '../lambdaCode.js';
import { validModelName, modelNameNotUnique, isSafeDescription, optionToExitApp } from './validation.js'


export async function getModelType(): Promise<'pre-trained' | 'fine-tuned'> {
  const modelType = await select({
    message: 'Please choose the type of model you want to deploy:',
    options: [
      { value: 'pre-trained', label: 'Pre-trained Model' },
      { value: 'fine-tuned', label: 'Fine-tuned Model' },
    ],
  });

  optionToExitApp(modelType);
  return modelType as 'pre-trained' | 'fine-tuned';
}

export async function getModelName(modelsConfigPath: string): Promise<string> {
  let modelName = await text({
    message: 'Enter a name for your model (this will be used in the API path):',
    placeholder: 'modelA',
  });

  optionToExitApp(modelName);
    //VALIDATE MODEL NAME is unique and appropriate for URL
    while (!validModelName(modelName, modelsConfigPath)) {
      if (modelNameNotUnique(modelName, modelsConfigPath)) {
        modelName = await text({
          message: '❌ Enter a unique model name',
          placeholder: 'modelA',
        });
  
        optionToExitApp(modelName)
      } else {
        modelName = await text({
          message: '❌ Only lowercase letters, numbers, hyphens or underscores, and start with a letter:',
          placeholder: 'modelA',
        });
  
        optionToExitApp(modelName)
      }
    }

  return modelName as string;
}

export async function getPreTrainedModel(): Promise<string> {
  const selectedModel = await select({
    message: 'Select a pre-trained model:',
    options: [
      { value: 'en_core_web_sm', label: 'en_core_web_sm' },
      { value: 'en_core_web_md', label: 'en_core_web_md' },
      { value: 'en_core_web_lg', label: 'en_core_web_lg' },
    ],
  });

  optionToExitApp(selectedModel);
  return selectedModel as string;
}

export async function getFineTunedModelPath(): Promise<string> {
  const modelPath = await text({
    message: 'Enter the directory path to your fine-tuned model (absolute path):',
    placeholder: '/path/to/your/model',
    validate(value): string | Error {
      if (value.length === 0) return 'Directory path is required.';
      if (!fs.existsSync(value)) return 'Directory does not exist.';
      return '';
    },
  });

  optionToExitApp(modelPath);
  return modelPath as string;
}

export async function getModelDescription(): Promise<string> {
  let description = await text({
    message: 'Enter a description for your model:',
    placeholder: 'This model is used for...'
  });

  //VALIDATE DESCRIPTION
  while (!isSafeDescription(description)) {
    description = await text({
      message: '❌ Invalid description. Use plain text under 200 characters. No special symbols like < > $ ; or backticks.',
      placeholder: 'modelA',
    });

    optionToExitApp(description)
  }
  
  optionToExitApp(description);
  return description as string;
}

export function generateModelFiles(
  modelType: 'pre-trained' | 'fine-tuned',
  modelPathOrName: string,
  modelDir: string,
  modelDescription: string
): void {
  const requirementsContent = 'spacy==3.8.2\n';
  const dockerFileContent = generateDockerfile(modelType, modelPathOrName, path);
  const lambdaFunctionContent = generateLambdaFile(modelType, modelPathOrName);

  writeModelFiles(modelDir, requirementsContent, dockerFileContent, lambdaFunctionContent, modelDescription);
} 