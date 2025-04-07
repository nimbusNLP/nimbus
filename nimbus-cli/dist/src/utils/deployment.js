import { note, spinner } from "@clack/prompts";
import chalk from "chalk";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { deployStack, deployStackWithCleanup, getApiUrlFromLogs, deleteModelFromFinishedDir, parseModelURL, } from "./deploymentHelperFuncs.js";
const execPromise = promisify(exec);
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
        note(`${chalk.green.underline(parseModelURL(res.stderr, modelName))}`, `${chalk.bold("⭐️ Your model endpoint ⭐️")}`);
    }
    catch (error) {
        console.error('Error deploying updated stack');
        //if an error occurs delete model from finished directory
        deleteModelFromFinishedDir(modelDir, finishedDirPath, modelName);
        throw error;
    }
}
export async function deleteModelFromStack(currentDir, finishedDirPath, modelName) {
    try {
        await deployStack(`Updating AWS resources removing model ${modelName}...`, `AWS resources updated after removing model ${modelName}!`, finishedDirPath, currentDir);
    }
    catch (error) {
        console.error(`Error deploying updated stack: ${error.message}`);
        throw error;
    }
}
export async function destroyStack(currentDir, finishedDirPath) {
    try {
        const spin = spinner();
        spin.start("Destroying stack...");
        const resp = await execPromise(`cdk destroy ApiGatewayStack --force -c finishedDirPath="${finishedDirPath}"`, {
            cwd: path.join(currentDir, "../nimbus-cdk"),
        });
        spin.stop("Stack destroyed! 💥");
    }
    catch (error) {
        console.error(`Error destroying stack: ${error.message}`);
        throw error;
    }
}
