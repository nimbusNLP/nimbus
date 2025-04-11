import { select, text } from "@clack/prompts";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { writeModelFiles } from "./fileSystem.js";
import generateDockerfile from "../dockerCode.js";
import generateLambdaFile from "../lambdaCode.js";
import {
  validModelName,
  modelNameNotUnique,
  isSafeDescription,
  optionToExitApp,
} from "./validation.js";

function getDirectorySize(dirPath: string, maxSize: number): number {
  let totalSize = 0;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        totalSize += getDirectorySize(fullPath, maxSize);
      } else if (entry.isFile()) {
        try {
          totalSize += fs.statSync(fullPath).size;
        } catch (err) {
          console.warn(`Could not get size of ${fullPath}: ${err.message}`);
        }
      }
      if (totalSize > maxSize) {
        return totalSize;
      }
    }
  } catch (err) {
    console.warn(
      `Could not read directory ${dirPath} during size check: ${err.message}`
    );
  }
  return totalSize;
}

function getDirectoryDepth(dirPath: string, currentDepth = 0): number {
  let maxDepth = currentDepth;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const depth = getDirectoryDepth(
          path.join(dirPath, entry.name),
          currentDepth + 1
        );
        if (depth > maxDepth) {
          maxDepth = depth;
        }
      }
    }
  } catch (err) {
    console.warn(
      `Could not read directory ${dirPath} during depth check: ${err.message}`
    );
    return currentDepth;
  }
  return maxDepth;
}

export async function getModelType(): Promise<"pre-trained" | "fine-tuned"> {
  const modelType = await select({
    message: "Please choose the type of model you want to deploy:",
    options: [
      { value: "pre-trained", label: chalk.white("Pre-trained Model") },
      { value: "fine-tuned", label: chalk.white("Fine-tuned Model") },
    ],
  });

  optionToExitApp(modelType);
  return modelType as "pre-trained" | "fine-tuned";
}

export async function getModelName(modelsConfigPath: string): Promise<string> {
  let modelName = await text({
    message: "Enter a name for your model (this will be used in the API path):",
    placeholder: "modelA",
  });

  optionToExitApp(modelName);
  while (!validModelName(modelName, modelsConfigPath)) {
    if (modelNameNotUnique(modelName, modelsConfigPath)) {
      modelName = await text({
        message: "❌ Enter a unique model name",
        placeholder: "modelA",
      });

      optionToExitApp(modelName);
    } else {
      modelName = await text({
        message: "❌ Only lowercase letters, numbers and start with a letter:",
        placeholder: "modelA",
      });

      optionToExitApp(modelName);
    }
  }

  return modelName as string;
}

export async function getPreTrainedModel(): Promise<string> {
  const selectedModel = await select({
    message: "Select a pre-trained model:",
    options: [
      { value: "en_core_web_sm", label: chalk.white("en_core_web_sm") },
      { value: "en_core_web_md", label: chalk.white("en_core_web_md") },
      { value: "en_core_web_lg", label: chalk.white("en_core_web_lg") },
    ],
  });

  optionToExitApp(selectedModel);
  return selectedModel as string;
}

export async function getFineTunedModelPath(): Promise<string> {
  const modelPath = await text({
    message:
      "Enter the directory path to your fine-tuned model (absolute path):",
    placeholder: "/path/to/your/model-best",
    validate(value): string | Error {
      if (value.length === 0) return "Directory path is required.";
      if (!fs.existsSync(value)) return "Directory does not exist.";

      try {
        if (!fs.statSync(value).isDirectory()) {
          return "Path is not a directory.";
        }

        const dirName = path.basename(value);
        if (dirName !== "model-best") {
          return "Directory must be named 'model-best'. Please provide the path to your model-best directory.";
        }

        const files = fs.readdirSync(value);
        if (files.length === 0) {
          return "Directory is empty.";
        }

        const maxSizeBytes = 500 * 1024 * 1024;
        const dirSize = getDirectorySize(value, maxSizeBytes);
        if (dirSize >= maxSizeBytes) {
          return `Directory is too large (${Math.round(
            dirSize / (1024 * 1024)
          )}MB). Maximum size is 500MB.`;
        }

        const dirDepth = getDirectoryDepth(value);
        if (dirDepth > 15) {
          return `Directory structure is too deep (${dirDepth} levels). Maximum depth is 15.`;
        }
      } catch (err) {
        return `Error validating directory: ${err.message}`;
      }

      return "";
    },
  });

  optionToExitApp(modelPath);
  return modelPath as string;
}

export async function getModelDescription(): Promise<string> {
  let description = await text({
    message: "Enter a description for your model:",
    placeholder: "",
  });

  while (!isSafeDescription(description)) {
    description = await text({
      message:
        "❌ Invalid description. Use plain text under 200 characters. No special symbols like < > $ ; or backticks.",
      placeholder: "modelA",
    });

    optionToExitApp(description);
  }

  optionToExitApp(description);
  return description as string;
}

export function generateModelFiles(
  modelType: "pre-trained" | "fine-tuned",
  modelPathOrName: string,
  modelDir: string,
  modelDescription: string
): void {
  const requirementsContent = "spacy==3.8.2\n";
  const dockerFileContent = generateDockerfile(
    modelType,
    modelPathOrName,
    path
  );
  const lambdaFunctionContent = generateLambdaFile(modelType, modelPathOrName);

  writeModelFiles(
    modelDir,
    requirementsContent,
    dockerFileContent,
    lambdaFunctionContent,
    modelDescription
  );
}
