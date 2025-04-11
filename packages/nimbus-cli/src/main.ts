#!/usr/bin/env node
import { deploy } from './deploy.js';
import { deleteModel } from './deleteModel.js';
import { listModels } from './list.js';
import { destroy } from './destroy.js';
import { configureApp } from './utils/config.js';
import { serveUi } from 'nimbus-ui-server';
import { displayCommandHelp } from './utils/coloredOutput.js';


process.on('SIGINT', () => {
  console.log('\nExiting Nimbus CLI...');
  process.exit(0);
});

async function main() {
  const args = process.argv.slice(2);
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
      displayCommandHelp();
    }
  }
}

main();
