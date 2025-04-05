#!/usr/bin/env node
import { deploy } from './deploy.js';
import { deleteModel } from './deleteModel.js';
import { listModels } from './list.js';
import { destroy } from './destroy.js';
import { configureApp } from './utils/config.js';
import { serveUi } from 'nimbus-ui-server';

async function main() {
  const args = process.argv;
  const [command] = args;

  let nimbusLocalStoragePath = await configureApp();

  switch (command) {
    case "deploy": {
      await deploy(nimbusLocalStoragePath);
      break;
    }
    case "list": {
      listModels(nimbusLocalStoragePath);
      break;
    }
    case "delete": {
      await deleteModel(nimbusLocalStoragePath);
      break;
    }
    case "destroy": {
      await destroy(nimbusLocalStoragePath);
      break;
    }
    case 'ui': {
      console.log('Serving UI...');
      await serveUi(nimbusLocalStoragePath);
      break;
    }
    default: {
      console.log('Available commands:');
      console.log('  deploy - Deploy a new model');
      console.log('  list   - List all deployed models');
      console.log('  delete - Delete a model');
      console.log('  destroy - Destroy the stack');
      console.log('  ui - Serve the UI');
    }
  }
}

main();
