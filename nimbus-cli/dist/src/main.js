#!/usr/bin/env node
import { deploy } from './deploy.js';
import { deleteModel } from './deleteModel.js';
import fs from 'fs';
import path from 'path';
function listModels() {
    const currentDir = process.cwd();
    const finishedDir = path.join(currentDir, 'finished_dir');
    const modelsConfigPath = path.join(finishedDir, 'models.json');
    try {
        const data = fs.readFileSync(modelsConfigPath, 'utf8');
        const json = JSON.parse(data);
        if (json.length === 0) {
            console.log('No models deployed yet.');
            return;
        }
        console.log('\nDeployed Models:');
        console.log('---------------');
        json.forEach(modelData => {
            console.log(`- ${modelData.modelName} (${modelData.modelType})`);
            console.log(`  Description: ${modelData.description}`);
        });
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No models deployed yet. Use "nimbus deploy" to deploy your first model.');
        }
        else {
            console.error('Error reading models configuration:', error);
        }
    }
}
async function main() {
    const args = process.argv;
    const [runtime, path, command] = args;
    switch (command) {
        case 'deploy': {
            await deploy();
            break;
        }
        case 'list': {
            listModels();
            break;
        }
        case 'delete': {
            await deleteModel();
            break;
        }
        default: {
            console.log('Available commands:');
            console.log('  deploy - Deploy a new model');
            console.log('  list   - List all deployed models');
            console.log('  delete - Delete a model');
        }
    }
}
main();
