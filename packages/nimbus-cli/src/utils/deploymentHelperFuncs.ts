import ora from 'ora';
import path from "path";
import fs from "fs";
import { readModelsConfig } from "./fileSystem.js";
import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";

const execPromise = promisify(exec);

export async function deployStackWithCleanup(
  startSpinnerMessage: string,
  stopSpinnerMessage: string,
  finishedDirPath: string,
  currentDir: string,
  modelName: string,
  modelDir: string
) {
  try {
    const result = await deployStack(
      startSpinnerMessage,
      stopSpinnerMessage,
      finishedDirPath,
      currentDir
    );
    return result;
  } catch (error) {
    console.log("❌  Deployment failed. Cleaning up...");
    deleteModelFromFinishedDir(modelDir, finishedDirPath, modelName);
    throw new Error(`Deployment failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deployStack(
  startSpinnerMessage: string,
  stopSpinnerMessage: string,
  finishedDirPath: string,
  currentDir: string
) {

   let spinner = ora({
      text: chalk.blue(startSpinnerMessage),
      spinner: 'dots',
      color: 'blue'
    }).start();
 
  const command = `cdk deploy ApiGatewayStack --require-approval never -c finishedDirPath="${finishedDirPath}"`;

  // Can remove currentDir being passed down multiple levels
  // instead find __dirname and create path to nodemodules here 
  try {
    const res = await execPromise(command, {
      cwd: path.join(currentDir, "../../node_modules/nimbus-cdk"),
    });

    spinner.succeed(chalk.green(stopSpinnerMessage));
    return res;
  } catch (error) {
    spinner.fail(chalk.red('Deployment failed'));
    throw error;
  }
}

export function getApiUrlFromLogs(res: { stdout: string; stderr: string }) {
  const apiUrl = res.stderr.split("ApiGatewayStack.RestApiUrl")[1] as string;
  const regex = /(https?:\/\/[^\s]+)/;
  const fin = apiUrl.match(regex) || [];
  return fin[0];
}

export function getApiKeyIdFromLogs(res: { stdout: string; stderr: string }) {
  const apiKeyId = res.stderr.split("ApiGatewayStack.ApiKeyId")[1] as string;
  const regex = /([a-zA-Z0-9]+)/;
  const fin = apiKeyId.match(regex) || [];
  return fin[0];
}

export function deleteModelFromFinishedDir(
  modelDir: string,
  finishedDirPath: string,
  modelName: string
) {
  if (fs.existsSync(modelDir)) {
    fs.rmSync(modelDir, { recursive: true, force: true });
  }

  const modelsJsonPath = path.join(finishedDirPath, "models.json");
  if (fs.existsSync(modelsJsonPath)) {
    const modelsJsonArr = readModelsConfig(modelsJsonPath);
    const updatedModelsJSON = modelsJsonArr.filter(
      (model) => model.modelName !== modelName
    );
    fs.writeFileSync(
      modelsJsonPath,
      JSON.stringify(updatedModelsJSON, null, 2)
    );
  }
}

export function parseModelURL(cdkOutput: string, modelName: string): string {
  return cdkOutput
    .split("Outputs")[1]
    .split(`ApiGatewayStack.ModelEndpoint${modelName} = `)[1]
    .split(" ")[0]
    .split("ApiGatewayStack.")[0]
    .replace(/\r?\n/g, "")
    .trim();
}

export function copyDirectory(source: string, destination: string): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function restoreModelToConfig(
  configPath: string,
  modelBackup: any
): void {
  try {
    const models = readModelsConfig(configPath);
    const existingModelIndex = models.findIndex(
      (m) => m.modelName === modelBackup.modelName
    );

    if (existingModelIndex === -1) {
      models.push(modelBackup);
    } else {
      models[existingModelIndex] = modelBackup;
    }

    fs.writeFileSync(configPath, JSON.stringify(models, null, 2));
  } catch (err) {
    console.error("❌  Error restoring model configuration:", err);
  }
}
