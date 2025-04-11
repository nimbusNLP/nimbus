import { note, spinner } from "@clack/prompts";
import chalk from "chalk";
import { exec } from "child_process";
import { promisify } from "util";
import {
  deployStack,
  deployStackWithCleanup,
  getApiUrlFromLogs,
  getApiKeyIdFromLogs,
  deleteModelFromFinishedDir,
  parseModelURL,
  copyDirectory,
  restoreModelToConfig
} from "./deploymentHelperFuncs.js";
import { removeModelFromConfig, removeModelDirectory } from "./fileSystem.js";
import * as fs from "fs";
import * as path from "path";
import { readModelsConfig } from "./fileSystem.js";
import { APIGatewayClient, GetApiKeyCommand } from "@aws-sdk/client-api-gateway";

const execPromise = promisify(exec);

export async function deployApiGateway(
  currentDir: string,
  finishedDirPath: string
): Promise<void> {
  try {
    const res = await deployStack(
      "Deploying API Gateway...",
      "API Gateway deployed!!!",
      finishedDirPath,
      currentDir
    );
  } catch (error: any) {
    console.error(`❌  Error deploying API Gateway: ${error.message}`);
    throw error;
  }
}

export async function deployUpdatedStack(
  currentDir: string,
  finishedDirPath: string,
  modelName: string,
  modelDir: string
): Promise<void> {
  try {
    const res = await deployStackWithCleanup(
      "Deploying model...",
      "Model deployed!!!",
      finishedDirPath,
      currentDir,
      modelName,
      modelDir
    );

    const apiGatewayURL = getApiUrlFromLogs(res);
    const apiKeyId = getApiKeyIdFromLogs(res);
    const apiKey = await fetchApiKey(apiKeyId);
    addToDotEnv(apiKey, apiGatewayURL);
    note(
      `${chalk.green.underline(apiKey)}`,
      `${chalk.bold("⭐️ Your API key ⭐️")}`
    );

    note(
      `${chalk.green.underline(parseModelURL(res.stderr, modelName))}`,
      `${chalk.bold("⭐️ Your model endpoint ⭐️")}`
    );
  } catch (error: any) {
    console.error("❌  Error deploying updated stack");
    //if an error occurs delete model from finished directory
    deleteModelFromFinishedDir(modelDir, finishedDirPath, modelName);
    throw error;
  }
}

function addToDotEnv(apiKey: string, apiGatewayURL: string) {
  fs.writeFileSync("./.env", `API_KEY=${apiKey}\nAPI_GATEWAY_URL=${apiGatewayURL}\n`);
}

// set up as a latter configuration file
const client = new APIGatewayClient({ region: "us-east-2" });

async function fetchApiKey(apiKeyId: string) {
  try {
    const command = new GetApiKeyCommand({
      apiKey: apiKeyId,
      includeValue: true,
    });

    const response = await client.send(command);
    console.log("API Key value:", response.value);
    return response.value;
  } catch (error: unknown) {
    console.error("Failed to get API key:", error);
    throw error; 
  }
}

export async function deleteModelFromStack(
  currentDir: string,
  finishedDirPath: string,
  modelName: string
): Promise<void> {
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

    await deployStack(
      `Removing model ${modelName}...`,
      `AWS resources updated after removing model ${modelName}!`,
      finishedDirPath,
      currentDir
    );

    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true, force: true });
    }
  } catch (error: any) {
    console.error(chalk.red.bold(`\n\n❌  ERROR DELETING MODEL \n\n`));

    if (modelBackup) {
      restoreModelToConfig(
        path.join(finishedDirPath, "models.json"),
        modelBackup
      );
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

export async function destroyStack(
  currentDir: string,
  finishedDirPath: string
): Promise<void> {
  try {
    const spin = spinner();
    spin.start("Destroying stack...");
    
    await execPromise(
      `cdk destroy ApiGatewayStack --force -c finishedDirPath="${finishedDirPath}"`,
      {
        cwd: path.join(currentDir, "../nimbus-cdk"),
      }
    );
    spin.stop("Stack destroyed! 💥");
  } catch (error: any) {
    console.error(`❌  Error destroying stack: ${error.message}`);
    throw error;
  }
}
