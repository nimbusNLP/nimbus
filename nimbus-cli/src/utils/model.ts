import { select, text, isCancel, cancel } from '@clack/prompts';
import fs from 'fs';
import path from 'path';
import { ModelConfig } from './fileSystem.js';
import { writeModelFiles } from './fileSystem.js';
import generateDockerfile from '../docker_code.js';
import generateLambdaFile from '../lambda_code.js';

export async function getModelType(): Promise<'pre-trained' | 'fine-tuned'> {
  const modelType = await select({
    message: 'Please choose the type of model you want to deploy:',
    options: [
      { value: 'pre-trained', label: 'Pre-trained Model' },
      { value: 'fine-tuned', label: 'Fine-tuned Model' },
    ],
  });

  if (isCancel(modelType)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  return modelType as 'pre-trained' | 'fine-tuned';
}

export async function getModelName(): Promise<string> {
  const modelName = await text({
    message: 'Enter a name for your model (this will be used in the API path):',
    placeholder: 'modelA',
  });

  if (isCancel(modelName)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  return modelName;
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

  if (isCancel(selectedModel)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

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

  if (isCancel(modelPath)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  return modelPath;
}

export function generateModelFiles(
  modelType: 'pre-trained' | 'fine-tuned',
  modelPathOrName: string,
  modelDir: string
): void {
  const requirementsContent = 'spacy==3.8.2\n';
  const dockerFileContent = generateDockerfile(modelType, modelPathOrName, path);
  const lambdaFunctionContent = generateLambdaFile(modelType, modelPathOrName);

  writeModelFiles(modelDir, requirementsContent, dockerFileContent, lambdaFunctionContent);
} 