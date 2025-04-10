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
