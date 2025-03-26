#!/usr/bin/env node
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

const fontName = 'small' as figlet.Fonts;

const asciiArt2 = figlet.textSync("Let's deploy a model!", {
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

let cdkDir: string;

async function main() {
  const modelType = await select({
    message: 'Please choose the type of model you want to use:',
    options: [
      { value: 'pre-trained', label: 'Pre-trained Model' },
      { value: 'fine-tuned', label: 'Fine-tuned Model' },
    ],
  });

  if (isCancel(modelType)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  let modelNameOrPath: string | symbol = '';

  if (modelType === 'pre-trained') {
    modelNameOrPath = await select({
      message: 'Select a pre-trained model:',
      options: [
        { value: 'en_core_web_sm', label: 'en_core_web_sm' },
        { value: 'en_core_web_md', label: 'en_core_web_md' },
        { value: 'en_core_web_lg', label: 'en_core_web_lg' },
      ],
    });

    if (isCancel(modelNameOrPath)) {
      cancel('Operation cancelled.');
      process.exit(0);
    }
  } else if (modelType === 'fine-tuned') {
    modelNameOrPath = await text({
      message: 'Please enter the directory path to your fine-tuned model:',
      placeholder: '/path/to/your/model',
      validate(value) {
        if (value.length === 0) return 'Directory path is required.';
        if (!fs.existsSync(value)) return 'Directory does not exist.';
      },
    });

    if (isCancel(modelNameOrPath)) {
      cancel('Operation cancelled.');
      process.exit(0);
    }
  }

  const requirementsContent = 'spacy==3.8.2\n';
  let dockerFileContent = generateDockerfile(modelType, modelNameOrPath, path);
  const lambdaFunctionContent = generateLambdaFile(modelType, modelNameOrPath);

  fs.writeFileSync(path.join(finishedDir, 'requirements.txt'), requirementsContent);
  fs.writeFileSync(path.join(finishedDir, 'Dockerfile'), dockerFileContent);
  fs.writeFileSync(path.join(finishedDir, 'lambda_function.py'), lambdaFunctionContent);

  const spaceship = `
        |
       / \\
      / _ \\
     |.o '.|
     |'._.'|
     |     |
   ,'|  |  |'.
  /  |  |  |  \\
  |,-'--|--'-.|
  `;
  console.log(chalk.hex('#FF69B4')(spaceship));
  console.log('Files have been generated in the finished_dir directory.');

  // Set the CDK directory (assuming your CDK code is in 'my-cdk-project' folder)
  cdkDir = path.join(currentDir, 'my-cdk-project');
  console.log(`Deploying CDK stack from ${cdkDir}...`);

  try {
    const { stdout: bootstrapStdout, stderr: bootstrapStderr } = await execPromise('cdk bootstrap', { cwd: cdkDir });
    console.log(`CDK bootstrap output:\n${bootstrapStdout}`);
    if (bootstrapStderr) console.error(`CDK bootstrap stderr:\n${bootstrapStderr}`);
  } catch (bootstrapError: any) {
    console.error(`Error during CDK bootstrap: ${bootstrapError.message}`);
    return;
  }

}

await main();

async function deploy() {
  try {
    const { stdout: deployStdout, stderr: deployStderr } = await execPromise('cdk deploy --require-approval never', { cwd: cdkDir });
    console.log(`cdk deploy --require-approval never output:\n${deployStdout}`);
    if (deployStderr) console.error(`CDK deploy stderr:\n${deployStderr}`);
  } catch (deployError: any) {
    console.error(`Error during CDK deploy: ${deployError.message}`);
  }
}

await deploy();

const asciiArt3 = figlet.textSync('We did it!', {
  font: 'Standard', 
  horizontalLayout: 'default',
  verticalLayout: 'default'
});
console.log(chalk.greenBright(asciiArt3));