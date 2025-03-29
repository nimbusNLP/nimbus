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

const asciiArt = figlet.textSync('NimbuS', {
  font: 'Standard', 
  horizontalLayout: 'default',
  verticalLayout: 'default'
});

const fontName = 'small' as figlet.Fonts;
const asciiArt2 = figlet.textSync("Let's deploy your models!", {
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

const modelsConfigPath = path.join(finishedDir, 'models.json');


if (!fs.existsSync(modelsConfigPath)) {
  fs.writeFileSync(modelsConfigPath, JSON.stringify([]));
}

async function main() {
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
    try {
      const { stdout, stderr } = await execPromise('cdk deploy ApiGatewayStack --require-approval never', { cwd: path.join(currentDir, '../nimbus-cdk') });
      console.log(`API Gateway deployed:\n${stdout}`);
      if (stderr) console.error(`API Gateway deploy stderr:\n${stderr}`);
    } catch (error: any) {
      console.error(`Error deploying API Gateway: ${error.message}`);
      process.exit(1);
    }
  }

  const deployModelChoice = await select({
    message: 'Are you ready to deploy a model?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
  });
  if (isCancel(deployModelChoice) || deployModelChoice === 'no') {
    console.log('No model deployed.');
    process.exit(0);
  }

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

  let modelPathOrName: string | symbol = '';
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
  } else {
    modelPathOrName = await text({
      message: 'Enter the directory path to your fine-tuned model (absolute path):',
      placeholder: '/path/to/your/model',
      validate(value) {
        if (value.length === 0) return 'Directory path is required.';
        if (!fs.existsSync(value)) return 'Directory does not exist.';
      },
    });
    if (isCancel(modelPathOrName)) {
      cancel('Operation cancelled.');
      process.exit(0);
    }

    const destination = path.join(finishedDir, modelName, 'model-best');
    try {
      fs.cpSync(modelPathOrName, destination, { recursive: true });
      console.log('Model directory copied successfully.');
    } catch (err) {
      console.error('Error copying model directory:', err);
    }
  }

  const modelDir = path.join(finishedDir, String(modelName));
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }

 
  const requirementsContent = 'spacy==3.8.2\n';
  let dockerFileContent = generateDockerfile(modelType, modelPathOrName, path);
  const lambdaFunctionContent = generateLambdaFile(modelType, modelPathOrName);

  fs.writeFileSync(path.join(modelDir, 'requirements.txt'), requirementsContent);
  fs.writeFileSync(path.join(modelDir, 'Dockerfile'), dockerFileContent);
  fs.writeFileSync(path.join(modelDir, 'lambda_function.py'), lambdaFunctionContent);


  const modelsConfig = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));
  modelsConfig.push({ modelName, modelType, modelPathOrName });
  fs.writeFileSync(modelsConfigPath, JSON.stringify(modelsConfig, null, 2));
  console.log(`Model ${modelName} configuration updated.`);

  try {
    const { stdout, stderr } = await execPromise(`cdk deploy ApiGatewayStack --require-approval never`, { cwd: path.join(currentDir, '../nimbus-cdk') });
    console.log(`Updated stack deployed:\n${stdout}`);
    if (stderr) console.error(`Deploy stderr:\n${stderr}`);
  } catch (error: any) {
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