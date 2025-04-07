import { note } from "@clack/prompts";
import chalk from "chalk";
import { deployStack, deployStackWithCleanup, getApiUrlFromLogs, deleteModelFromFinishedDir, parseModelURL, copyDirectory, restoreModelToConfig } from "./deploymentHelperFuncs.js";
import { removeModelFromConfig, removeModelDirectory } from "./fileSystem.js";
import * as fs from "fs";
import * as path from "path";
import { readModelsConfig } from "./fileSystem.js";
export async function deployApiGateway(currentDir, finishedDirPath) {
    try {
        const res = await deployStack("Deploying API Gateway...", "API Gateway deployed!!!", finishedDirPath, currentDir);
        const apiGatewayURL = getApiUrlFromLogs(res);
        note(`${chalk.green.underline(apiGatewayURL)}`, `${chalk.bold("⭐️ Your API endpoint ⭐️")}`);
    }
    catch (error) {
        console.error(`Error deploying API Gateway: ${error.message}`);
        throw error;
    }
}
export async function deployUpdatedStack(currentDir, finishedDirPath, modelName, modelDir) {
    try {
        const res = await deployStackWithCleanup("Deploying model...", "Model deployed!!!", finishedDirPath, currentDir, modelName, modelDir);
        const apiGatewayURL = getApiUrlFromLogs(res);
        note(`${chalk.green.underline(apiGatewayURL)}`, `${chalk.bold("⭐️ Your API endpoint ⭐️")}`);
        note(`${chalk.green.underline(parseModelURL(res.stderr, modelName))}`, `${chalk.bold("⭐️ Your model endpoint ⭐️")}`);
    }
    catch (error) {
        console.error("Error deploying updated stack");
        //if an error occurs delete model from finished directory
        deleteModelFromFinishedDir(modelDir, finishedDirPath, modelName);
        throw error;
    }
}
export async function deleteModelFromStack(currentDir, finishedDirPath, modelName) {
    // Backup the model data before deletion
    let modelBackup = null;
    let modelDirectoryBackupPath = null;
    const backupDir = path.join(finishedDirPath, "backup");
    try {
        // Backup model
        const modelsConfigPath = path.join(finishedDirPath, "models.json");
        const allModels = readModelsConfig(modelsConfigPath);
        modelBackup = allModels.find((model) => model.modelName === modelName);
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        const modelDir = path.join(finishedDirPath, modelName);
        modelDirectoryBackupPath = path.join(backupDir, modelName);
        if (fs.existsSync(modelDir)) {
            copyDirectory(modelDir, modelDirectoryBackupPath);
        }
        removeModelFromConfig(modelsConfigPath, modelName);
        removeModelDirectory(finishedDirPath, modelName);
        await deployStack(`Removing model ${modelName}...`, `AWS resources updated after removing model ${modelName}!`, finishedDirPath, currentDir);
        if (fs.existsSync(backupDir)) {
            fs.rmSync(backupDir, { recursive: true, force: true });
        }
    }
    catch (error) {
        console.error(chalk.red.bold(`\n\n❗️ ERROR DELETING MODEL ❗️\n\n`));
        if (modelBackup) {
            restoreModelToConfig(path.join(finishedDirPath, "models.json"), modelBackup);
        }
        if (modelDirectoryBackupPath && fs.existsSync(modelDirectoryBackupPath)) {
            const modelDir = path.join(finishedDirPath, modelName);
            copyDirectory(modelDirectoryBackupPath, modelDir);
        }
        if (fs.existsSync(backupDir)) {
            fs.rmSync(backupDir, { recursive: true, force: true });
        }
        throw error;
    }
}
export async function destroyStack(currentDir, finishedDirPath) {
    try {
        await deployStack("Destroying stack...", "Stack destroyed! 💥", finishedDirPath, currentDir);
    }
    catch (error) {
        console.error(`Error destroying stack: ${error.message}`);
        throw error;
    }
}
