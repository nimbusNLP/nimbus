import { readModelsConfig } from "./fileSystem.js";
import { isCancel, cancel } from "@clack/prompts";
export function validModelName(modelName, modelsConfigPath) {
  if (typeof modelName !== "string" || !modelName.trim()) {
    return false;
  }
  const isValid = /^[a-z][a-z0-9-_]{0,29}$/.test(String(modelName));
  return isValid && !modelNameNotUnique(modelName, modelsConfigPath)
    ? true
    : false;
}
export function modelNameNotUnique(modelName, modelsConfigPath) {
  let arrOfModelObjs = readModelsConfig(modelsConfigPath);
  const present = arrOfModelObjs.find((model) => model.modelName === modelName);
  return !!present;
}
export function isSafeDescription(description) {
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
export function optionToExitApp(loc) {
  if (isCancel(loc)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
}
