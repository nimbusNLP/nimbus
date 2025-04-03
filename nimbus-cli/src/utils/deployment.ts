import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { spinner, note } from "@clack/prompts";
import chalk from "chalk";
import fs from "fs";
import { readModelsConfig } from "./fileSystem.js";

const execPromise = promisify(exec);

async function deployStack(
  startSpinnerMessage: string,
  stopSpinnerMessage: string,
  finishedDirPath: string,
  currentDir: string,
) {
  const spin = spinner();
  spin.start(startSpinnerMessage);
  const command = `cdk deploy ApiGatewayStack --require-approval never -c finishedDirPath="${finishedDirPath}"`;

  const res = await execPromise(command, {
    cwd: path.join(currentDir, "../nimbus-cdk"),
  });

  spin.stop(stopSpinnerMessage);
  return res;
}

function getApiUrlFromLogs(res: { stdout: string; stderr: string }) {
  const apiUrl = res.stderr.split("ApiGatewayStack.RestApiUrl")[1];
  const regex = /(https?:\/\/[^\s]+)/;
  return apiUrl.match(regex)[0];
}

export async function deployApiGateway(
  currentDir: string,
  finishedDirPath: string,
): Promise<void> {
  try {
    const res = await deployStack(
      "Deploying API Gateway...",
      "API Gateway deployed!!!",
      finishedDirPath,
      currentDir,
    );
    const apiGatewayURL = getApiUrlFromLogs(res);
    note(
      `${chalk.green.underline(apiGatewayURL)}`,
      `${chalk.bold("⭐️ Your API endpoint ⭐️")}`,
    );
  } catch (error: any) {
    console.error(`Error deploying API Gateway: ${error.message}`);
    throw error;
  }
}

export async function deployUpdatedStack(
  currentDir: string,
  finishedDirPath: string,
  modelName: string,
  modelDir: string,
): Promise<void> {
  try {
    const res = await deployStack(
      "Deploying model...",
      "Model deployed!!!",
      finishedDirPath,
      currentDir,
    );
    note(
      `${chalk.green.underline(parseModelURL(res.stderr, modelName))}`,
      `${chalk.bold("⭐️ Your model endpoint ⭐️")}`,
    );
  } catch (error: any) {
    console.error(`Error deploying updated stack: ${error.message}`);
    // delete directory and model from finished_dir/ models.json
    fs.rmSync(modelDir, { recursive: true, force: true });
    const modelsJsonArr = readModelsConfig(
      path.join(finishedDirPath, "models.json"),
    );
    const updatedModelsJSON = modelsJsonArr.filter(
      (model) => model.modelName !== modelName,
    );
    fs.writeFileSync(
      path.join(finishedDirPath, "models.json"),
      JSON.stringify(updatedModelsJSON, null, 2),
    );
    throw error;
  }
}

export async function deleteModelFromStack(
  currentDir: string,
  finishedDirPath: string,
  modelName: string,
): Promise<void> {
  try {
    await deployStack(
      `Updating AWS resources removing model ${modelName}...`,
      `AWS resources updated after removing model ${modelName}!`,
      finishedDirPath,
      currentDir,
    );
  } catch (error: any) {
    console.error(`Error deploying updated stack: ${error.message}`);
    throw error;
  }
}

export async function destroyStack(
  currentDir: string,
  finishedDirPath: string,
): Promise<void> {
  try {
    await deployStack(
      "Destroying stack...",
      "Stack destroyed! 💥",
      finishedDirPath,
      currentDir,
    );
  } catch (error: any) {
    console.error(`Error destroying stack: ${error.message}`);
    throw error;
  }
}

function parseModelURL(cdkOutput: string, modelName: string): string {
  return cdkOutput
    .split("Outputs")[1]
    .split(`ApiGatewayStack.ModelEndpoint${modelName} = `)[1]
    .split(" ")[0]
    .split("ApiGatewayStack.")[0]
    .replace(/\r?\n/g, "")
    .trim();
}
