import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { spinner, note } from '@clack/prompts';
import chalk from 'chalk';
const execPromise = promisify(exec);
export async function deployApiGateway(currentDir) {
    try {
        const spin = spinner();
        spin.start('Deploying API Gateway...');
        const res = await execPromise('cdk deploy ApiGatewayStack --require-approval never', {
            cwd: path.join(currentDir, '../nimbus-cdk')
        });
        const apiUrl = res.stderr.split('ApiGatewayStack.RestApiUrl')[1];
        const regex = /(https?:\/\/[^\s]+)/;
        const apiGatewayURL = apiUrl.match(regex)[0];
        note(`${chalk.green.underline(apiGatewayURL)}`, `${chalk.bold('⭐️ Your API endpoint ⭐️')}`);
        spin.stop('API Gateway deployed!!!');
    }
    catch (error) {
        console.error(`Error deploying API Gateway: ${error.message}`);
        throw error;
    }
}
export async function deployUpdatedStack(currentDir, modelName) {
    try {
        const spin = spinner();
        spin.start('Deploying model...');
        const res = await execPromise('cdk deploy ApiGatewayStack --require-approval never', {
            cwd: path.join(currentDir, '../nimbus-cdk')
        });
        note(`${chalk.green.underline(parseModelURL(res.stderr, modelName))}`, `${chalk.bold('⭐️ Your model endpoint ⭐️')}`);
        spin.stop('Model deployed!!!');
    }
    catch (error) {
        console.error(`Error deploying updated stack: ${error.message}`);
        throw error;
    }
}
export async function deleteModelFromStack(currentDir, modelName) {
    try {
        const spin = spinner();
        spin.start(`Updating AWS resources removing model ${modelName}...`);
        const res = await execPromise('cdk deploy ApiGatewayStack --require-approval never', {
            cwd: path.join(currentDir, '../nimbus-cdk')
        });
        spin.stop(`AWS resources updated after removing model ${modelName}!`);
    }
    catch (error) {
        console.error(`Error deploying updated stack: ${error.message}`);
        throw error;
    }
}
/**
 * Parses the model URL from CDK output.
 * Note: CDK sanitizes output keys by removing special characters,
 * so ModelEndpoint_${modelName} becomes ModelEndpoint${modelName}
 */
function parseModelURL(cdkOutput, modelName) {
    return cdkOutput
        .split('Outputs')[1]
        .split(`ApiGatewayStack.ModelEndpoint${modelName} = `)[1]
        .split(' ')[0]
        .split('ApiGatewayStack.')[0]
        .replace(/\r?\n/g, '')
        .trim();
}
