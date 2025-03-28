#!/usr/bin/env node
// import figlet from 'figlet';
// import chalk from 'chalk';
// import { select, text, isCancel, cancel } from '@clack/prompts';
// import fs from 'fs';
// import path from 'path';
// import generateDockerfile from './src/docker_code.js';
// import generateLambdaFile from './src/lambda_code.js';
// import { exec } from 'child_process';
// import { promisify } from 'util';
// const execPromise = promisify(exec);
// const asciiArt = figlet.textSync('spaCadet', {
//   font: 'Standard', 
//   horizontalLayout: 'default',
//   verticalLayout: 'default'
// });
// const fontName = 'Small' as figlet.Fonts;
// const asciiArt2 = figlet.textSync("Let's deploy a model!", {
//   font: fontName,
//   horizontalLayout: 'default',
//   verticalLayout: 'default'
// });
// console.log(chalk.greenBright(asciiArt));
// console.log(chalk.blue(asciiArt2));
// const currentDir = process.cwd();
// const finishedDir = path.join(currentDir, 'finished_dir');
// if (!fs.existsSync(finishedDir)) { 
//   fs.mkdirSync(finishedDir);
// }
// let cdkDir: string;
// async function main() {
//   const modelType = await select({
//     message: 'Please choose the type of model you want to use:',
//     options: [
//       { value: 'pre-trained', label: 'Pre-trained Model' },
//       { value: 'fine-tuned', label: 'Fine-tuned Model' },
//     ],
//   });
//   if (isCancel(modelType)) {
//     cancel('Operation cancelled.');
//     process.exit(0);
//   }
//   let modelNameOrPath: string | symbol = '';
//   if (modelType === 'pre-trained') {
//     modelNameOrPath = await select({
//       message: 'Select a pre-trained model:',
//       options: [
//         { value: 'en_core_web_sm', label: 'en_core_web_sm' },
//         { value: 'en_core_web_md', label: 'en_core_web_md' },
//         { value: 'en_core_web_lg', label: 'en_core_web_lg' },
//       ],
//     });
//     if (isCancel(modelNameOrPath)) {
//       cancel('Operation cancelled.');
//       process.exit(0);
//     }
//   } else if (modelType === 'fine-tuned') {
//     modelNameOrPath = await text({
//       message: 'Please enter the directory path to your fine-tuned model. Ensure that it is an absolute path:',
//       placeholder: '/path/to/your/model',
//       validate(value) {
//         if (value.length === 0) return 'Directory path is required.';
//         if (!fs.existsSync(value)) return 'Directory does not exist.';
//       },
//     });
//     if (isCancel(modelNameOrPath)) {
//       cancel('Operation cancelled.');
//       process.exit(0);
//     }
//     const destination = path.join(process.cwd(), 'finished_dir', 'model-best');
//     try {
//       fs.cpSync(modelNameOrPath, destination, { recursive: true });
//       console.log('Directory copied successfully.');
//     } catch (err) {
//       console.error('Error copying directory:', err);
//     }
//   }
//   const requirementsContent = 'spacy==3.8.2\n';
//   let dockerFileContent = generateDockerfile(modelType, modelNameOrPath, path);
//   const lambdaFunctionContent = generateLambdaFile(modelType, modelNameOrPath);
//   fs.writeFileSync(path.join(finishedDir, 'requirements.txt'), requirementsContent);
//   fs.writeFileSync(path.join(finishedDir, 'Dockerfile'), dockerFileContent);
//   fs.writeFileSync(path.join(finishedDir, 'lambda_function.py'), lambdaFunctionContent);
//   const spaceship = `
//         |
//        / \\
//       / _ \\
//      |.o '.|
//      |'._.'|
//      |     |
//    ,'|  |  |'.
//   /  |  |  |  \\
//   |,-'--|--'-.|
//   `;
//   console.log(chalk.hex('#FF69B4')(spaceship));
//   console.log('Files have been generated in the finished_dir directory.');
//   // Set the CDK directory (assuming your CDK code is in 'my-cdk-project' folder)
//   cdkDir = path.join(currentDir, '../nimbus-cdk');
//   console.log(`Deploying CDK stack from ${cdkDir}...`);
//   try {
//     const { stdout: bootstrapStdout, stderr: bootstrapStderr } = await execPromise('cdk bootstrap', { cwd: cdkDir });
//     console.log(`CDK bootstrap output:\n${bootstrapStdout}`);
//     if (bootstrapStderr) console.error(`CDK bootstrap stderr:\n${bootstrapStderr}`);
//   } catch (bootstrapError: any) {
//     console.error(`Error during CDK bootstrap: ${bootstrapError.message}`);
//     return;
//   }
// }
// await main();
// async function deploy() {
//   try {
//     const { stdout: deployStdout, stderr: deployStderr } = await execPromise('cdk deploy --require-approval never', { cwd: cdkDir });
//     console.log(`cdk deploy --require-approval never output:\n${deployStdout}`);
//     if (deployStderr) console.error(`CDK deploy stderr:\n${deployStderr}`);
//   } catch (deployError: any) {
//     console.error(`Error during CDK deploy: ${deployError.message}`);
//   }
// }
// await deploy();
// const asciiArt3 = figlet.textSync('We did it!', {
//   font: 'Standard', 
//   horizontalLayout: 'default',
//   verticalLayout: 'default'
// });
// console.log(chalk.greenBright(asciiArt3));
import figlet from 'figlet';
import chalk from 'chalk';
import { select, text, isCancel, cancel } from '@clack/prompts';
import fs from 'fs';
import path from 'path';
import generateDockerfile from './src/docker_code.js';
import generateLambdaFile from './src/lambda_code.js';
import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);
const asciiArt = figlet.textSync('spaCadet', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
});
const fontName = 'small';
const asciiArt2 = figlet.textSync("Let's deploy your apps!", {
    font: fontName,
    horizontalLayout: 'default',
    verticalLayout: 'default'
});
console.log(chalk.greenBright(asciiArt));
console.log(chalk.blue(asciiArt2));
const currentDir = process.cwd();
const finishedDir = path.join(currentDir, 'finished_dir');
if (!fs.existsSync(finishedDir)) {
    fs.mkdirSync(finishedDir);
}
// Path to models configuration file – this keeps track of models that have been deployed.
const modelsConfigPath = path.join(finishedDir, 'models.json');
// Initialize models config if it doesn’t exist.
if (!fs.existsSync(modelsConfigPath)) {
    fs.writeFileSync(modelsConfigPath, JSON.stringify([]));
}
async function main() {
    // If no models have been deployed yet, offer to deploy the base API Gateway.
    let deployApi = false;
    if (fs.readFileSync(modelsConfigPath, 'utf8') === '[]') {
        const deployChoice = await select({
            message: 'Do you want to deploy the API Gateway?',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
        });
        if (isCancel(deployChoice) || deployChoice === 'no') {
            cancel('Operation cancelled.');
            process.exit(0);
        }
        deployApi = true;
    }
    if (deployApi) {
        // Deploy the base stack (API Gateway with no models yet)
        try {
            const { stdout, stderr } = await execPromise('cdk deploy ApiGatewayStack --require-approval never', { cwd: path.join(currentDir, '../nimbus-cdk') });
            console.log(`API Gateway deployed:\n${stdout}`);
            if (stderr)
                console.error(`API Gateway deploy stderr:\n${stderr}`);
        }
        catch (error) {
            console.error(`Error deploying API Gateway: ${error.message}`);
            process.exit(1);
        }
    }
    // Ask if the user wants to deploy a model.
    const deployModelChoice = await select({
        message: 'Do you want to deploy a model?',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
        ],
    });
    if (isCancel(deployModelChoice) || deployModelChoice === 'no') {
        console.log('No model deployed.');
        process.exit(0);
    }
    // Get model deployment details.
    const modelType = await select({
        message: 'Please choose the type of model you want to deploy:',
        options: [
            { value: 'pre-trained', label: 'Pre-trained Model' },
            { value: 'fine-tuned', label: 'Fine-tuned Model' },
        ],
    });
    if (isCancel(modelType)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    const modelName = await text({
        message: 'Enter a name for your model (this will be used in the API path):',
        placeholder: 'modelA',
    });
    if (isCancel(modelName)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    let modelPathOrName = '';
    if (modelType === 'pre-trained') {
        const selectedModel = await select({
            message: 'Select a pre-trained model:',
            options: [
                { value: 'en_core_web_sm', label: 'en_core_web_sm' },
                { value: 'en_core_web_md', label: 'en_core_web_md' },
                { value: 'en_core_web_lg', label: 'en_core_web_lg' },
            ],
        });
        if (isCancel(selectedModel)) {
            cancel('Operation cancelled.');
            process.exit(0);
        }
        modelPathOrName = selectedModel;
    }
    else {
        modelPathOrName = await text({
            message: 'Enter the directory path to your fine-tuned model (absolute path):',
            placeholder: '/path/to/your/model',
            validate(value) {
                if (value.length === 0)
                    return 'Directory path is required.';
                if (!fs.existsSync(value))
                    return 'Directory does not exist.';
            },
        });
        if (isCancel(modelPathOrName)) {
            cancel('Operation cancelled.');
            process.exit(0);
        }
        // Copy the model directory to finished_dir if needed.
        const destination = path.join(finishedDir, 'model-best');
        try {
            fs.cpSync(modelPathOrName, destination, { recursive: true });
            console.log('Model directory copied successfully.');
        }
        catch (err) {
            console.error('Error copying model directory:', err);
        }
    }
    // Generate required files for the model deployment.
    const requirementsContent = 'spacy==3.8.2\n';
    let dockerFileContent = generateDockerfile(modelType, modelPathOrName, path);
    const lambdaFunctionContent = generateLambdaFile(modelType, modelPathOrName);
    fs.writeFileSync(path.join(finishedDir, 'requirements.txt'), requirementsContent);
    fs.writeFileSync(path.join(finishedDir, 'Dockerfile'), dockerFileContent);
    fs.writeFileSync(path.join(finishedDir, 'lambda_function.py'), lambdaFunctionContent);
    // Update the models configuration file.
    const modelsConfig = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));
    modelsConfig.push({ modelName, modelType, modelPathOrName });
    fs.writeFileSync(modelsConfigPath, JSON.stringify(modelsConfig, null, 2));
    console.log(`Model ${modelName} configuration updated.`);
    // Deploy the updated combined stack, which now reads the models configuration file
    try {
        const { stdout, stderr } = await execPromise(`cdk deploy ApiGatewayStack --require-approval never`, { cwd: path.join(currentDir, '../nimbus-cdk') });
        console.log(`Updated stack deployed:\n${stdout}`);
        if (stderr)
            console.error(`Deploy stderr:\n${stderr}`);
    }
    catch (error) {
        console.error(`Error deploying updated stack: ${error.message}`);
    }
}
await main();
const asciiArt3 = figlet.textSync('Deployment Complete!', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
});
console.log(chalk.greenBright(asciiArt3));
