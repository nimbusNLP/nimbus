import fs from "fs";
import path from "path";

export interface ModelConfig {
  modelName: string;
  modelType: "pre-trained" | "fine-tuned";
  modelPathOrName: string;
  description: string;
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
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

export function updateModelsConfig(
  configPath: string,
  newConfig: ModelConfig,
): void {
  const config = readModelsConfig(configPath);
  config.push(newConfig);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function removeModelFromConfig(
  configPath: string,
  modelName: string,
): void {
  const config = readModelsConfig(configPath);
  const index = config.findIndex((model) => model.modelName === modelName);
  if (index !== -1) {
    config.splice(index, 1);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}

export function removeModelDirectory(baseDir: string, modelName: string): void {
  const modelDir = path.join(baseDir, modelName);
  if (fs.existsSync(modelDir)) {
    fs.rmSync(modelDir, { recursive: true, force: true });
  } else {
    console.log(`❌  Model directory "${modelName}" does not exist.`);
  }
}

export function copyModelDirectory(source: string, destination: string): void {
  try {

    if (!fs.existsSync(source)) {
      console.error(`❌ Source directory does not exist: ${source}`);
      throw new Error(`Source directory does not exist: ${source}`);
    }
    
    if (!fs.statSync(source).isDirectory()) {
      console.error(`❌ Source is not a directory: ${source}`);
      throw new Error(`Source is not a directory: ${source}`);
    }
    
    const files = fs.readdirSync(source);
  
    
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    for (const file of files) {
      const srcPath = path.join(source, file);
      const destPath = path.join(destination, file);
    
      
      if (fs.statSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error("❌ Error copying model directory:", err);
    throw err;
  }
}

export function deleteFinishedDir(baseDir: string): void {
  const finishedDir = path.join(baseDir, "finished_dir");
  if (fs.existsSync(finishedDir)) {
    fs.rmSync(finishedDir, { recursive: true, force: true });
  }
}

export function writeModelFiles(
  modelDir: string,
  requirementsContent: string,
  dockerFileContent: string,
  lambdaFunctionContent: string,
  modelDescription: string,
): void {
  fs.writeFileSync(
    path.join(modelDir, "requirements.txt"),
    requirementsContent,
  );
  fs.writeFileSync(path.join(modelDir, "Dockerfile"), dockerFileContent);
  fs.writeFileSync(
    path.join(modelDir, "lambda_function.py"),
    lambdaFunctionContent,
  );
  fs.writeFileSync(path.join(modelDir, "description.txt"), modelDescription);
}