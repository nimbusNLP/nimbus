import fs from 'fs';
import path from 'path';

export interface ModelConfig {
  modelName: string;
  modelType: 'pre-trained' | 'fine-tuned';
  modelPathOrName: string;
}

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function initializeModelsConfig(configPath: string): void {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify([]));
  }
}

export function readModelsConfig(configPath: string): ModelConfig[] {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

export function updateModelsConfig(configPath: string, newConfig: ModelConfig): void {
  const config = readModelsConfig(configPath);
  config.push(newConfig);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function copyModelDirectory(source: string, destination: string): void {
  try {
    fs.cpSync(source, destination, { recursive: true });
    console.log('Model directory copied successfully.');
  } catch (err) {
    console.error('Error copying model directory:', err);
    throw err;
  }
}

export function writeModelFiles(
  modelDir: string,
  requirementsContent: string,
  dockerFileContent: string,
  lambdaFunctionContent: string
): void {
  fs.writeFileSync(path.join(modelDir, 'requirements.txt'), requirementsContent);
  fs.writeFileSync(path.join(modelDir, 'Dockerfile'), dockerFileContent);
  fs.writeFileSync(path.join(modelDir, 'lambda_function.py'), lambdaFunctionContent);
} 