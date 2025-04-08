#!/usr/bin/env node

/**
 * Standalone Vitest runner script
 * This script allows you to run Vitest tests without installing Vitest as a dependency
 * It uses npx to temporarily install and run Vitest
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);

console.log(`Running Vitest with arguments: ${args.join(' ') || 'none'}`);

try {
  // Use the existing vitest.config.ts file
  const configPath = path.join(__dirname, 'vitest.config.ts');
  
  // Check if we're running coverage or watch mode
  const isCoverage = args.includes('--coverage');
  const isWatch = args.includes('--watch');
  
  // Remove these flags from args as we'll handle them differently
  const filteredArgs = args.filter(arg => arg !== '--coverage' && arg !== '--watch');
  
  // If running coverage, make sure we install the coverage provider
  const packages = isCoverage ? ['vitest', '@vitest/coverage-v8'] : ['vitest'];
  
  // Build the command - use 'run' mode for coverage, 'watch' for watch mode
  let command;
  if (isWatch) {
    command = `npx --yes ${packages.join(' ')} vitest watch ${filteredArgs.join(' ')} --config ${configPath}`;
  } else {
    // Always use 'run' mode for non-watch (including coverage)
    // Add --no-watch to ensure it doesn't go into watch mode after running
    command = `npx --yes ${packages.join(' ')} vitest run ${filteredArgs.join(' ')} ${isCoverage ? '--coverage' : ''} --no-watch --config ${configPath}`;
  }
  
  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit' });
  
  // Exit immediately after running coverage tests
  if (isCoverage) {
    process.exit(0);
  }
  
} catch (error) {
  console.error('Error running Vitest:', error.message);
  process.exit(1);
}
