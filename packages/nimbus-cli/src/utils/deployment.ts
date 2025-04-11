// import { note } from "@clack/prompts";
// import chalk from "chalk";
// import { exec } from "child_process";
// import { promisify } from "util";
// import {
//   deployStack,
//   deployStackWithCleanup,
//   getApiUrlFromLogs,
//   getApiKeyIdFromLogs,
//   deleteModelFromFinishedDir,
//   parseModelURL,
//   copyDirectory,
//   restoreModelToConfig
// } from "./deploymentHelperFuncs.js";
// import { removeModelFromConfig, removeModelDirectory } from "./fileSystem.js";
// import * as fs from "fs";
// import * as path from "path";
// import { readModelsConfig } from "./fileSystem.js";
// import { APIGatewayClient, GetApiKeyCommand } from "@aws-sdk/client-api-gateway";
// import ora from 'ora'; 

// const execPromise = promisify(exec);


// export async function deployUpdatedStack(
//   currentDir: string,
//   finishedDirPath: string,
//   modelName: string,
//   modelDir: string
// ): Promise<void> {
//   const deploySpinner = ora({
//     text: chalk.blue(`Deploying model ${chalk.cyan.bold(modelName)}...`),
//     spinner: 'dots',
//     color: 'blue'
//   }).start();


//     const res = await deployStackWithCleanup(
//       "", 
//       "",
//       finishedDirPath,
//       currentDir,
//       modelName,
//       modelDir
//     );

//     deploySpinner.succeed(chalk.green(`Model ${chalk.cyan.bold(modelName)} deployed successfully!`));

//     const apiGatewayURL = getApiUrlFromLogs(res);
//     const apiKeyId = getApiKeyIdFromLogs(res);
//     const apiKey = await fetchApiKey(apiKeyId);
//     addToDotEnv(apiKey, apiGatewayURL);
//     note(
//       `${chalk.green.underline(apiKey)}`,
//       `${chalk.bold("Your API key")}`
//     );
//     const modelUrl = parseModelURL(res.stderr, modelName);
    
//     note(
//       `${chalk.green.underline(modelUrl)}`,
//       `${chalk.bold("Your model endpoint")}`
//     );
//   } 

// function addToDotEnv(apiKey: string, apiGatewayURL: string) {
//   fs.writeFileSync("./.env", `API_KEY=${apiKey}\nAPI_GATEWAY_URL=${apiGatewayURL}\n`);
// }
// const client = new APIGatewayClient({ region: "us-east-2" });

// export async function fetchApiKey(apiKeyId: string) {
//   try {
//     const command = new GetApiKeyCommand({
//       apiKey: apiKeyId,
//       includeValue: true,
//     });

//     const response = await client.send(command);
//     return response.value;
//   } catch (error: unknown) {
//     console.error("Failed to get API key:", error);
//     throw error; 
//   }
// }

// export async function deleteModelFromStack(
//   currentDir: string,
//   finishedDirPath: string,
//   modelName: string
// ): Promise<void> {
//   let modelBackup = null;
//   let modelDirectoryBackupPath = null;
//   const backupDir = path.join(finishedDirPath, "backup");

//   try {
//     const modelsConfigPath = path.join(finishedDirPath, "models.json");
//     const allModels = readModelsConfig(modelsConfigPath);
//     modelBackup = allModels.find((model) => model.modelName === modelName);

//     // Create backup directory if it doesn't exist
//     if (!fs.existsSync(backupDir)) {
//       fs.mkdirSync(backupDir, { recursive: true });
//     }

//     // Backup the model directory
//     const modelDir = path.join(finishedDirPath, modelName);
//     if (fs.existsSync(modelDir)) {
//       modelDirectoryBackupPath = path.join(backupDir, modelName);
//       copyDirectory(modelDir, modelDirectoryBackupPath);
//     }

//     // Backup the models.json file
//     const modelsJsonBackupPath = path.join(backupDir, "models.json");
//     fs.copyFileSync(modelsConfigPath, modelsJsonBackupPath);

//     // Remove the model from the config file
//     removeModelFromConfig(modelsConfigPath, modelName);

//     // Remove the model directory
//     if (fs.existsSync(modelDir)) {
//       fs.rmSync(modelDir, { recursive: true, force: true });
//     }
//       const restoreSpinner = ora({
//         text: chalk.yellow(`Restoring model ${chalk.cyan.bold(modelName)} from backup...`),
//         spinner: "dots",
//       }).start();
      
//       try {
//         // Restore model to config
//         if (modelBackup) {
//           restoreModelToConfig(
//             path.join(finishedDirPath, "models.json"),
//             modelBackup
//           );
//         }

//         // Restore model directory
//         if (modelDirectoryBackupPath && fs.existsSync(modelDirectoryBackupPath)) {
//           const modelDir = path.join(finishedDirPath, modelName);
//           copyDirectory(modelDirectoryBackupPath, modelDir);
//         }
        
//         restoreSpinner.succeed(chalk.green(`Successfully restored model ${chalk.cyan.bold(modelName)} from backup`));
//       } catch (restoreError) {
//         restoreSpinner.fail(chalk.red(`Failed to restore model ${chalk.cyan.bold(modelName)} from backup`));
//         console.error(chalk.red(`Restore error: ${restoreError.message}`));
//       }
      
//       // Clean up the backup directory
//       if (fs.existsSync(backupDir)) {
//         fs.rmSync(backupDir, { recursive: true, force: true });
//       }
      
//       throw new Error('Docker is not running. Please start Docker Desktop and try again.');
//     }

//     // Run cdk destroy to remove the cloud resources
//     const spinner = ora({
//       text: chalk.blue(`Deleting cloud resources for model ${chalk.cyan.bold(modelName)}...`),
//       spinner: "dots",
//     }).start();

//     const cdkDir = path.join(currentDir, "../nimbus-cdk");
//     // Pass the finishedDirPath context variable to the CDK command
//     const cdkDestroyCommand = `cd ${cdkDir} && pnpm cdk destroy ${modelName}Stack --force -c finishedDirPath=${finishedDirPath}`;

//     try {
//       await execPromise(cdkDestroyCommand);
//       spinner.succeed(chalk.green(`Model ${chalk.cyan.bold(modelName)} deleted from AWS`));
      
//       // Redeploy the API Gateway to update the routes
//       const redeploySpinner = ora({
//         text: chalk.blue(`Updating API Gateway to remove model routes...`),
//         spinner: "dots",
//       }).start();
      
//       try {
//         // Use a more reliable command that doesn't suppress all output
//         // This ensures we can detect and handle errors properly
//         const deployCommand = `cd ${cdkDir} && pnpm cdk deploy ApiGatewayStack --require-approval never -c finishedDirPath=${finishedDirPath}`;
//         const result = await execPromise(deployCommand);
        
//         // Verify the deployment was successful by checking for common success patterns in the output
//         if (result.stdout.includes('ApiGatewayStack: deploy') || 
//             result.stderr.includes('ApiGatewayStack: deploy')) {
//           redeploySpinner.succeed(chalk.green(`API Gateway updated successfully`));
//         } else {
//           // If we can't confirm success but there was no error, show a warning
//           redeploySpinner.warn(chalk.yellow(`API Gateway update completed, but verification was inconclusive`));
//           console.log(chalk.yellow(`You may want to verify the API Gateway configuration in the AWS console`));
//         }
//       } catch (redeployError) {
//         redeploySpinner.fail(chalk.red(`Failed to update API Gateway`));
//         console.error(chalk.yellow(`Warning: The API Gateway was not updated. You may need to redeploy it manually.`));
//         console.error(chalk.yellow(`Error details: ${redeployError.message}`));
        
//         // Try a second time with a different approach
//         const retrySpinner = ora({
//           text: chalk.blue(`Retrying API Gateway update...`),
//           spinner: "dots",
//         }).start();
        
//         try {
//           // Try with a simpler command
//           await execPromise(`cd ${cdkDir} && pnpm cdk deploy ApiGatewayStack --require-approval never -c finishedDirPath=${finishedDirPath} --outputs-file /tmp/stack-outputs.json`);
//           retrySpinner.succeed(chalk.green(`API Gateway updated successfully on retry`));
//         } catch (retryError) {
//           retrySpinner.fail(chalk.red(`Failed to update API Gateway after retry`));
//           console.error(chalk.red(`You will need to manually run: cd ${cdkDir} && pnpm cdk deploy ApiGatewayStack`));
//         }
//       }
//     } catch (error) {
//       spinner.fail(chalk.red(`Failed to delete model ${chalk.cyan.bold(modelName)} from AWS`));
//       console.error(chalk.red(`Error: ${error.message}`));
//       throw error;
//     }

//     // Clean up the backup directory
//     if (fs.existsSync(backupDir)) {
//       fs.rmSync(backupDir, { recursive: true, force: true });
//     }
//   } catch (error) {
//     console.error(chalk.red(`❌ Error deleting model ${chalk.cyan.bold(modelName)}:`), error);

//     // Restore from backup if available
//     if (fs.existsSync(backupDir)) {
//       const restoreSpinner = ora({
//         text: chalk.yellow(`Attempting to restore model ${chalk.cyan.bold(modelName)} from backup...`),
//         spinner: "dots",
//       }).start();
      
//       try {
//         // Restore model to config
//         if (modelBackup) {
//           restoreModelToConfig(
//             path.join(finishedDirPath, "models.json"),
//             modelBackup
//           );
//         }

//         // Restore model directory
//         if (modelDirectoryBackupPath && fs.existsSync(modelDirectoryBackupPath)) {
//           const modelDir = path.join(finishedDirPath, modelName);
//           copyDirectory(modelDirectoryBackupPath, modelDir);
//         }
        
//         restoreSpinner.succeed(chalk.green(`Successfully restored model ${chalk.cyan.bold(modelName)} from backup`));
//       } catch (restoreError) {
//         restoreSpinner.fail(chalk.red(`Failed to restore model ${chalk.cyan.bold(modelName)} from backup`));
//         console.error(chalk.red(`Restore error: ${restoreError.message}`));
//       }
//     }

//     // Clean up the backup directory
//     if (fs.existsSync(backupDir)) {
//       fs.rmSync(backupDir, { recursive: true, force: true });
//     }

//     throw error;
//   }
// }

// export async function destroyStack(
//   currentDir: string,
//   finishedDirPath: string
// ): Promise<void> {
//   try {
//     // Check if Docker is running before attempting to destroy the stack
//     const dockerSpinner = ora({
//       text: chalk.blue(`Checking Docker availability...`),
//       spinner: "dots",
//     }).start();

//     try {
//       await execPromise('docker info');
//       dockerSpinner.succeed(chalk.green(`Docker is running`));
//     } catch (dockerError) {
//       dockerSpinner.fail(chalk.red(`Docker is not running`));
//       console.error(chalk.red(`Docker is required for AWS operations but is not running.`));
//       console.error(chalk.yellow(`Please start Docker Desktop and try again.`));
//       throw new Error('Docker is not running. Please start Docker Desktop and try again.');
//     }

//     const spin = ora().start("Destroying stack...");
    
//     await execPromise(
//       `cdk destroy ApiGatewayStack --force -c finishedDirPath="${finishedDirPath}"`,
//       {
//         cwd: path.join(currentDir, "../nimbus-cdk"),
//       }
//     );
//     spin.succeed("Stack destroyed!");
//   } catch (error: any) {
//     console.error(chalk.red(`Error destroying stack: ${error.message}`));
//     throw error;
//   }
// }
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
    deleteModelFromFinishedDir(modelDir, finishedDirPath, modelName);
    throw error;
  }
}

function addToDotEnv(apiKey: string, apiGatewayURL: string) {
  fs.writeFileSync("./.env", `API_KEY=${apiKey}\nAPI_GATEWAY_URL=${apiGatewayURL}\n`);
}

const client = new APIGatewayClient({ region: "us-east-2" });

export async function fetchApiKey(apiKeyId: string) {
  try {
    const command = new GetApiKeyCommand({
      apiKey: apiKeyId,
      includeValue: true,
    });
    const response = await client.send(command);
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

  let modelBackup = null;
  let modelDirectoryBackupPath = null;
  const backupDir = path.join(finishedDirPath, "backup");
  try {
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