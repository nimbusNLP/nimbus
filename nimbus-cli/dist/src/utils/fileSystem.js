import fs from "fs";
import path from "path";
export function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
export function initializeModelsConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify([]));
  }
}
export function readModelsConfig(configPath) {
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}
export function updateModelsConfig(configPath, newConfig) {
  const config = readModelsConfig(configPath);
  config.push(newConfig);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
export function removeModelFromConfig(configPath, modelName) {
  const config = readModelsConfig(configPath);
  const index = config.findIndex((model) => model.modelName === modelName);
  if (index !== -1) {
    config.splice(index, 1);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}
export function removeModelDirectory(baseDir, modelName) {
  const modelDir = path.join(baseDir, modelName);
  if (fs.existsSync(modelDir)) {
    fs.rmSync(modelDir, { recursive: true, force: true });
  } else {
    console.log(`Model directory "${modelName}" does not exist.`);
  }
}
export function copyModelDirectory(source, destination) {
  try {
    fs.cpSync(source, destination, { recursive: true });
    console.log("Model directory copied successfully.");
  } catch (err) {
    console.error("Error copying model directory:", err);
    throw err;
  }
}
export function deleteFinishedDir(baseDir) {
  const finishedDir = path.join(baseDir, "finished_dir");
  if (fs.existsSync(finishedDir)) {
    fs.rmSync(finishedDir, { recursive: true, force: true });
  }
}
export function writeModelFiles(
  modelDir,
  requirementsContent,
  dockerFileContent,
  lambdaFunctionContent,
  modelDescription,
) {
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
