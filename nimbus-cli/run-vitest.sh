#!/bin/bash

# Run Vitest without installing it permanently
# This script uses npx to temporarily install and run Vitest

# Default to running all tests if no arguments provided
TEST_FILES=${@:-"tests/*.vitest.ts"}

# Run Vitest with the specified test files
echo "Running Vitest on: $TEST_FILES"
npx --yes vitest run $TEST_FILES
