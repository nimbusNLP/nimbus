import { spinner } from "@clack/prompts";
import path from "path";
import fs from "fs";
import { readModelsConfig } from "./fileSystem.js";
import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);
export async function deployStackWithCleanup(startSpinnerMessage, stopSpinnerMessage, finishedDirPath, currentDir, modelName, modelDir) {
    try {
        const result = await deployStack(startSpinnerMessage, stopSpinnerMessage, finishedDirPath, currentDir);
        return result;
    }
    catch (error) {
        console.log('Deployment failed. Cleaning up...');
        deleteModelFromFinishedDir(modelDir, finishedDirPath, modelName);
    }
    throw Error;
}
export async function deployStack(startSpinnerMessage, stopSpinnerMessage, finishedDirPath, currentDir) {
    const spin = spinner();
    spin.start(startSpinnerMessage);
    const command = `cdk deploy ApiGatewayStack --require-approval never -c finishedDirPath="${finishedDirPath}"`;
    const res = await execPromise(command, {
        cwd: path.join(currentDir, "../nimbus-cdk"),
    });
    spin.stop(stopSpinnerMessage);
    return res;
}
export function getApiUrlFromLogs(res) {
    const apiUrl = res.stderr.split("ApiGatewayStack.RestApiUrl")[1];
    const regex = /(https?:\/\/[^\s]+)/;
    const fin = apiUrl.match(regex) || [];
    return fin[0];
}
export function deleteModelFromFinishedDir(modelDir, finishedDirPath, modelName) {
    if (fs.existsSync(modelDir)) {
        fs.rmSync(modelDir, { recursive: true, force: true });
    }
    const modelsJsonPath = path.join(finishedDirPath, "models.json");
    if (fs.existsSync(modelsJsonPath)) {
        const modelsJsonArr = readModelsConfig(modelsJsonPath);
        const updatedModelsJSON = modelsJsonArr.filter((model) => model.modelName !== modelName);
        fs.writeFileSync(modelsJsonPath, JSON.stringify(updatedModelsJSON, null, 2));
    }
}
export function parseModelURL(cdkOutput, modelName) {
    return cdkOutput
        .split("Outputs")[1]
        .split(`ApiGatewayStack.ModelEndpoint${modelName} = `)[1]
        .split(" ")[0]
        .split("ApiGatewayStack.")[0]
        .replace(/\r?\n/g, "")
        .trim();
}
