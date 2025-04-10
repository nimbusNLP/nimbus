#!/usr/bin/env node
import { deploy } from './deploy.js';
import { deleteModel } from './deleteModel.js';
import { listModels } from './list.js';
import { destroy } from './destroy.js';
import { configureApp } from './utils/config.js';
import { serveUi } from 'nimbus-ui-server';
import { cancel, isCancel } from '@clack/prompts';
import { 
  displayColoredBanner, 
  displayCommandHelp, 
  displayPlainBanner, 
  displayPlainCommandHelp 
} from './utils/coloredOutput.js';

export async function main() {
  const args = process.argv.slice(2);
  const [command] = args;

  try {
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
        try {
          displayColoredBanner();
          displayCommandHelp();
        } catch (error) {
          // Fallback to plain text if there's an error with chalk
          displayPlainBanner();
          displayPlainCommandHelp();
        }
      }
    }

  } catch (error) {
    if (error instanceof Error && error.message === "CANCELLED") {
      cancel("Operation cancelled.");
      process.exit(0);
    }
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main();