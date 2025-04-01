#!/usr/bin/env node
import { deploy } from './deploy.js';
import { deleteModel } from './deleteModel.js';
import { listModels } from './list.js';

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