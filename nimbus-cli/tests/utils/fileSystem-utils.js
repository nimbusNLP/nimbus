/**
 * Simplified file system utilities for testing
 * These functions mimic the behavior of the actual fileSystem.ts functions
 * but are written in plain JavaScript for easier testing
 */

// Mock fs and path modules
const fs = {
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  rmSync: jest.fn(),
  cpSync: jest.fn()
};

const path = {
  join: jest.fn((...args) => args.join('/'))
};

// File system utility functions
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function initializeModelsConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify([]));
  }
}

function readModelsConfig(configPath) {
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

function updateModelsConfig(configPath, newConfig) {
  const config = readModelsConfig(configPath);
  config.push(newConfig);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function removeModelFromConfig(configPath, modelName) {
  const config = readModelsConfig(configPath);
  const index = config.findIndex((model) => model.modelName === modelName);
  if (index !== -1) {
    config.splice(index, 1);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}

function removeModelDirectory(baseDir, modelName) {
  const modelDir = path.join(baseDir, modelName);
  if (fs.existsSync(modelDir)) {
    fs.rmSync(modelDir, { recursive: true, force: true });
  } else {
    console.log(`❌  Model directory "${modelName}" does not exist.`);
  }
}

function copyModelDirectory(source, destination) {
  try {
    fs.cpSync(source, destination, { recursive: true });
  } catch (err) {
    console.error("❌  Error copying model directory:", err);
    throw err;
  }
}

function deleteFinishedDir(baseDir) {
  const finishedDir = path.join(baseDir, "finished_dir");
  if (fs.existsSync(finishedDir)) {
    fs.rmSync(finishedDir, { recursive: true, force: true });
  }
}

function writeModelFiles(
  modelDir,
  requirementsContent,
  dockerFileContent,
  lambdaFunctionContent,
  modelDescription
) {
  fs.writeFileSync(
    path.join(modelDir, "requirements.txt"),
    requirementsContent
  );
  fs.writeFileSync(path.join(modelDir, "Dockerfile"), dockerFileContent);
  fs.writeFileSync(
    path.join(modelDir, "lambda_function.py"),
    lambdaFunctionContent
  );
  fs.writeFileSync(path.join(modelDir, "description.txt"), modelDescription);
}

// Export functions and mocks for testing
module.exports = {
  fs,
  path,
  ensureDirectoryExists,
  initializeModelsConfig,
  readModelsConfig,
  updateModelsConfig,
  removeModelFromConfig,
  removeModelDirectory,
  copyModelDirectory,
  deleteFinishedDir,
  writeModelFiles
};
