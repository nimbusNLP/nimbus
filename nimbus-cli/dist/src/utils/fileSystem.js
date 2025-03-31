import fs from 'fs';
import path from 'path';
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
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}
export function updateModelsConfig(configPath, newConfig) {
    const config = readModelsConfig(configPath);
    config.push(newConfig);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
export function copyModelDirectory(source, destination) {
    try {
        fs.cpSync(source, destination, { recursive: true });
        console.log('Model directory copied successfully.');
    }
    catch (err) {
        console.error('Error copying model directory:', err);
        throw err;
    }
}
export function writeModelFiles(modelDir, requirementsContent, dockerFileContent, lambdaFunctionContent) {
    fs.writeFileSync(path.join(modelDir, 'requirements.txt'), requirementsContent);
    fs.writeFileSync(path.join(modelDir, 'Dockerfile'), dockerFileContent);
    fs.writeFileSync(path.join(modelDir, 'lambda_function.py'), lambdaFunctionContent);
}
