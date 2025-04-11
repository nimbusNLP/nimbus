import chalk from "chalk";

export function displayWelcomeMessage(): void {
  console.log(chalk.blue('\nDEPLOY MODEL'));
  console.log(chalk.blue('============'));
}

export function displayCompletionMessage(): void {
  console.log(chalk.green('\nDEPLOYMENT COMPLETE'));
  console.log(chalk.green('=================='));
}

export function displayDeleteWelcomeMessage(): void {
  console.log(chalk.blue('\nDELETE MODEL'));
  console.log(chalk.blue('============'));
}

export function displayDeleteCompletionMessage(): void {
  console.log(chalk.green('\nDELETION COMPLETE'));
  console.log(chalk.green('================'));
}

export function displayDestroyWelcomeMessage(): void {
  console.log(chalk.red('\nDESTROY STACK'));
  console.log(chalk.red('============='));
}

export function displayDestroyCompletionMessage(): void {
  console.log(chalk.red('\nSTACK DESTROYED'));
  console.log(chalk.red('==============='));
}

export function displayListWelcomeMessage(): void {
  console.log(chalk.blue('\nMODEL LIST'));
  console.log(chalk.blue('=========='));
}

