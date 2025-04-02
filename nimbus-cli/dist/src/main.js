#!/usr/bin/env node
import { deploy } from './deploy.js';
import { deleteModel } from './deleteModel.js';
import { listModels } from './list.js';
import { destroy } from './destroy.js';
import { configureApp } from './utils/config.js';
async function main() {
    const args = process.argv;
    const [runtime, path, command] = args;
    let nimbusLocalStoragePath = await configureApp();
    switch (command) {
        case 'deploy': {
            await deploy(nimbusLocalStoragePath);
            break;
        }
        case 'list': {
            listModels(nimbusLocalStoragePath);
            break;
        }
        case 'delete': {
            await deleteModel(nimbusLocalStoragePath);
            break;
        }
        case 'destroy': {
            await destroy(nimbusLocalStoragePath);
            break;
        }
        default: {
            console.log('Available commands:');
            console.log('  deploy - Deploy a new model');
            console.log('  list   - List all deployed models');
            console.log('  delete - Delete a model');
            console.log('  destroy - Destroy the stack');
        }
    }
}
main();
