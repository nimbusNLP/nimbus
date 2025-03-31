import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { spinner } from "@clack/prompts";
const execPromise = promisify(exec);
export async function deployApiGateway(currentDir) {
  try {
    const spin = spinner();
    spin.start("Deploying API Gateway...");
    await execPromise("cdk deploy ApiGatewayStack --require-approval never", {
      cwd: path.join(currentDir, "../nimbus-cdk"),
    });
    spin.stop("API Gateway deployed!!!");
  } catch (error) {
    console.error(`Error deploying API Gateway: ${error.message}`);
    throw error;
  }
}
export async function deployUpdatedStack(currentDir) {
  try {
    const spin = spinner();
    spin.start("Deploying model...");
    await execPromise("cdk deploy ApiGatewayStack --require-approval never", {
      cwd: path.join(currentDir, "../nimbus-cdk"),
    });
    spin.stop("Model deployed!!!");
  } catch (error) {
    console.error(`Error deploying updated stack: ${error.message}`);
    throw error;
  }
}
