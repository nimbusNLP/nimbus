import chalk from 'chalk';

export function displayColoredBanner(): void {
  console.log('\n' + chalk.blue.bold('███████ NIMBUS CLI ███████') + '\n');
}

export function displayCommandHelp(): void {
  console.log(chalk.bold.cyan('Available commands:'));
  console.log(chalk.green('  deploy  ') + '- Deploy a new model');
  console.log(chalk.green('  list    ') + '- List all deployed models');
  console.log(chalk.green('  delete  ') + '- Delete a model');
  console.log(chalk.green('  destroy ') + '- Destroy the stack');
  console.log(chalk.green('  ui      ') + '- Serve the UI');
  console.log('\n' + chalk.italic.cyan('Run a command to get started') + '\n');
}

export function displayPlainBanner(): void {
  console.log('\n=== NIMBUS CLI ===\n');
}

export function displayPlainCommandHelp(): void {
  console.log('Available commands:');
  console.log('  deploy  - Deploy a new model');
  console.log('  list    - List all deployed models');
  console.log('  delete  - Delete a model');
  console.log('  destroy - Destroy the stack');
  console.log('  ui      - Serve the UI');
  console.log('\nRun a command to get started\n');
}

/**
 * Displays a list of models in a simplified format
 * @param models The list of models to display
 * @param baseUrl The base URL for the API endpoint
 * @param apiKey The API key (optional)
 */
export function displayModelList(
  models: any[],
  baseUrl?: string,
  apiKey?: string
): void {
  console.log(chalk.blue.bold('\nNIMBUS DEPLOYED MODELS'));
  console.log(chalk.blue('======================'));
  
  if (apiKey) {
    console.log(chalk.white(`\nAPI Key: ${chalk.cyan(apiKey)}`));
  }
  
  if (models.length === 0) {
    console.log(chalk.yellow('\nNo models deployed.'));
    console.log(chalk.white(`Use "${chalk.green('nimbusCLI deploy')}" to deploy your first model.`));
    return;
  }
  

  console.log(chalk.white(`\nTotal Models: ${chalk.cyan(models.length.toString())}`));
  

  models.forEach((model, index) => {
    console.log(chalk.white(`\n${index + 1}. ${chalk.cyan.bold(model.modelName)} (${chalk.yellow(model.modelType)})`));

    if (model.description) {
      console.log(chalk.white(`   Description: ${model.description}`));
    }
    
    const modelEndpoint = model.endpoint || (baseUrl ? `${baseUrl}${model.modelName}/predict` : undefined);
    
    if (modelEndpoint) {
      console.log(chalk.white(`   Endpoint: ${chalk.green(modelEndpoint)}`));
    } else {
      console.log(chalk.gray(`   Endpoint not available - deploy API Gateway first`));
    }
  });
  

  console.log(chalk.blue('\n======================'));
}

/**
 * Displays a colorful interface for the delete model process
 * @param modelName The name of the model to delete
 * @param modelType The type of the model
 * @param description The description of the model
 * @param isConfirmation Whether this is the confirmation screen
 */
export function displayDeleteModelInterface(
  modelName: string,
  modelType: string,
  description: string,
  isConfirmation: boolean = false
): void {
  const boxWidth = 70;
  console.log(chalk.magenta('┌' + '─'.repeat(boxWidth - 2) + '┐'));
  
  if (isConfirmation) {
    console.log(chalk.magenta('│') + chalk.red.bold(` CONFIRM DELETION `.padEnd(boxWidth - 2)) + chalk.magenta('│'));
  } else {
    console.log(chalk.magenta('│') + chalk.yellow.bold(` DELETE MODEL `.padEnd(boxWidth - 2)) + chalk.magenta('│'));
  }
  
  console.log(chalk.magenta('├' + '─'.repeat(boxWidth - 2) + '┤'));

  console.log(chalk.magenta('│') + chalk.white(` Model Name: `) + chalk.cyan.bold(`${modelName}`.padEnd(boxWidth - 15)) + chalk.magenta('│'));
  console.log(chalk.magenta('│') + chalk.white(` Model Type: `) + chalk.green(`${modelType}`.padEnd(boxWidth - 15)) + chalk.magenta('│'));
  const descriptionLines = wrapText(description, boxWidth - 16);
  console.log(chalk.magenta('│') + chalk.white(` Description: `) + chalk.yellow(`${descriptionLines[0]}`.padEnd(boxWidth - 16)) + chalk.magenta('│'));
  
  for (let i = 1; i < descriptionLines.length; i++) {
    console.log(chalk.magenta('│') + ' '.repeat(14) + chalk.yellow(`${descriptionLines[i]}`.padEnd(boxWidth - 16)) + chalk.magenta('│'));
  }
  
  if (isConfirmation) {
    console.log(chalk.magenta('├' + '─'.repeat(boxWidth - 2) + '┤'));
    console.log(chalk.magenta('│') + chalk.red.bold(` WARNING: This action cannot be undone! `.padEnd(boxWidth - 2)) + chalk.magenta('│'));
    console.log(chalk.magenta('│') + chalk.red(` All cloud resources for this model will be deleted. `.padEnd(boxWidth - 2)) + chalk.magenta('│'));
  }
  
  console.log(chalk.magenta('└' + '─'.repeat(boxWidth - 2) + '┘'));
}

/**
 * Displays a colorful success message after model deletion
 * @param modelName The name of the deleted model
 */
export function displayDeleteSuccess(modelName: string): void {
  const boxWidth = 70;
  
  console.log(chalk.green('┌' + '─'.repeat(boxWidth - 2) + '┐'));
  console.log(chalk.green('│') + chalk.white.bold(` SUCCESS `.padEnd(boxWidth - 2)) + chalk.green('│'));
  console.log(chalk.green('├' + '─'.repeat(boxWidth - 2) + '┤'));
  console.log(chalk.green('│') + chalk.white(` Model `) + chalk.cyan.bold(`${modelName}`) + chalk.white(` has been successfully deleted.`.padEnd(boxWidth - 13 - modelName.length)) + chalk.green('│'));
  console.log(chalk.green('│') + chalk.white(` All associated cloud resources have been removed.`.padEnd(boxWidth - 2)) + chalk.green('│'));
  console.log(chalk.green('└' + '─'.repeat(boxWidth - 2) + '┘'));
}


export function displayNoModelsToDelete(): void {
  console.log(chalk.yellow('\nNO MODELS TO DELETE'));
  console.log(chalk.white('Deploy a model first with "nimbusCLI deploy" before trying to delete.'));
}


export function displayNoModelSelected(): void {
  console.log(chalk.yellow('\nNO MODEL SELECTED'));
  console.log(chalk.white('Operation canceled. No changes were made.'));
}

/**
 * Displays a message when proceeding to remove a model
 * @param modelName The name of the model to remove
 */
export function displayRemovingModel(modelName: string): void {
  console.log(chalk.cyan(`\nREMOVING MODEL: ${chalk.yellow(modelName)}`));
  console.log(chalk.white('Removing model and associated cloud resources...'));
}

/**
 * Improved text wrapping function that handles long words better
 * @param text The text to wrap
 * @param maxLength The maximum length of each line
 * @returns An array of wrapped lines
 */
function wrapText(text: string, maxLength: number): string[] {
  if (!text || text.length <= maxLength) {
    return [text || ""];
  }
  
  const result: string[] = [];
  const words = text.split(' ');
  let currentLine = '';
  
  for (const word of words) {
    if (word.length > maxLength) {
      if (currentLine) {
        result.push(currentLine);
        currentLine = '';
      }
      
      for (let i = 0; i < word.length; i += maxLength) {
        if (i + maxLength >= word.length) {
          currentLine = word.substring(i);
        } else {
          result.push(word.substring(i, i + maxLength));
        }
      }
    } 
    else if (currentLine.length + word.length + 1 <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      result.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) {
    result.push(currentLine);
  }
  
  return result;
}