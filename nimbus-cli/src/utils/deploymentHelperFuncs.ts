import { spinner } from "@clack/prompts";
import path from "path";
import fs from "fs";
import { readModelsConfig } from "./fileSystem.js";
import { exec } from "child_process";
import { promisify } from "util";

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
    throw error;
  }
}

export async function deployStack(
  startSpinnerMessage: string,
  stopSpinnerMessage: string,
  finishedDirPath: string,
  currentDir: string
) {
  const spin = spinner();
  spin.start(startSpinnerMessage);

  // Create a unique output directory for this deployment
  const timestamp = Date.now();
  const outputDir = `cdk.out.${timestamp}`;
  
  // Use our pure JavaScript CDK app to avoid TypeScript compilation issues
  // Add --output flag to use a unique output directory
  const command = `cdk deploy ApiGatewayStack --require-approval never -c finishedDirPath="${finishedDirPath}" --app "node cdk-deploy.js" --output ${outputDir}`;

  try {
    const res = await execPromise(command, {
      cwd: path.join(currentDir, "../nimbus-cdk"),
    });
    
    spin.stop(stopSpinnerMessage);
    return res;
  } catch (error) {
    spin.stop("Deployment failed");
    console.error("CDK deployment error:", error);
    throw error;
  }
}

export function getApiUrlFromLogs(res: { stdout: string; stderr: string }) {
  try {
    const apiUrl = res.stderr.split("ApiGatewayStack.RestApiUrl")[1] as string;
    const regex = /(https?:\/\/[^\s]+)/;
    const fin = apiUrl.match(regex) || [];
    return fin[0];
  } catch (error) {
    console.error("Error parsing API URL from logs:", error);
    throw new Error("Failed to parse API URL from CDK output");
  }
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
