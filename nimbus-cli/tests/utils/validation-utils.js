/**
 * Simplified validation utilities for testing
 * These functions mimic the behavior of the actual validation.ts functions
 * but are written in plain JavaScript for easier testing
 */

// Validation functions
function validModelName(modelName, modelsConfigPath) {
  if (typeof modelName !== "string" || !modelName.trim()) {
    return false;
  }
  const isValid = /^[a-z][a-z0-9]{0,29}$/.test(String(modelName));
  return isValid && !modelNameNotUnique(modelName, modelsConfigPath);
}

function modelNameNotUnique(modelName, modelsConfigPath) {
  // Mock implementation for testing
  const existingModels = ['existingModel', 'anotherModel'];
  return existingModels.includes(modelName);
}

function isSafeDescription(description) {
  if (description === undefined) return true;
  return (
    typeof description === "string" &&
    (description === "" ||
      (description.length <= 200 &&
        !/[<>]/.test(description) &&
        !/[\x00-\x1F\x7F]/.test(description) &&
        !/[$`;]/.test(description)))
  );
}

function optionToExitApp(input) {
  // Mock implementation for testing
  if (input === Symbol.for('clack/cancel')) {
    process.exit(0);
  }
}

module.exports = {
  validModelName,
  modelNameNotUnique,
  isSafeDescription,
  optionToExitApp
};
