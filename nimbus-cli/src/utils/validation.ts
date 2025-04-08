import { readModelsConfig } from "./fileSystem.js";
import { isCancel, cancel } from "@clack/prompts";

export function validModelName(
  modelName: string | symbol,
  modelsConfigPath: string,
): boolean {
  if (typeof modelName !== "string" || !modelName.trim()) {
    return false;
  }
  const isValid = /^[a-z][a-z0-9]{0,29}$/.test(String(modelName));
  return isValid && !modelNameNotUnique(modelName, modelsConfigPath)
    ? true
    : false;
}

export function modelNameNotUnique(
  modelName: string | symbol,
  modelsConfigPath: string,
): boolean {
  let arrOfModelObjs = readModelsConfig(modelsConfigPath);
  const present = arrOfModelObjs.find((model) => model.modelName === modelName);
  return !!present;
}

export function isSafeDescription(description: string | symbol | undefined): boolean {
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

export function optionToExitApp(input: string | symbol): void {
  if (isCancel(input)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
}
