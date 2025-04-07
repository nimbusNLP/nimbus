import { select, text } from "@clack/prompts";
import fs from "fs";
import path from "path";
import os from "os";
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
      { value: "pre-trained", label: "Pre-trained Model" },
      { value: "fine-tuned", label: "Fine-tuned Model" },
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
      { value: "en_core_web_sm", label: "en_core_web_sm" },
      { value: "en_core_web_md", label: "en_core_web_md" },
      { value: "en_core_web_lg", label: "en_core_web_lg" },
    ],
  });

  optionToExitApp(selectedModel);
  return selectedModel as string;
}

export async function getFineTunedModelPath(): Promise<string> {
  const MAX_DEPTH = 10;
  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const VALIDATION_TIMEOUT_MS = 2000;
  const homeDir = os.homedir();

  let modelPathInput: string | symbol | null = null;
  let normalizedPath: string = "";
  let isValid = false;

  while (!isValid) {
    modelPathInput = await text({
      message:
        "Enter the directory path to your fine-tuned model (absolute path):",
      placeholder: "/path/to/your/model",
      validate(value): string | Error | undefined {
        if (value.length === 0) return "Directory path is required.";
        if (!path.isAbsolute(value)) return "Path must be absolute.";

        try {
          const tempNormalizedPath = path.resolve(value);
          if (
            tempNormalizedPath === homeDir ||
            tempNormalizedPath === path.parse(homeDir).root
          ) {
            return `❌ Cannot use home directory or root as model path.`;
          }
          const commonDirs = [
            os.homedir(),
            "/Users",
            "/home",
            "/mnt",
            "/Volumes",
            "/",
          ];
          if (commonDirs.includes(tempNormalizedPath)) {
            return `❌ Please select a specific model directory, not a top-level system folder.`;
          }
          if (!fs.existsSync(tempNormalizedPath))
            return new Error("Directory does not exist.");
          if (!fs.statSync(tempNormalizedPath).isDirectory())
            return new Error("Path is not a directory.");
        } catch (err) {
          return new Error(`❌ Error accessing path: ${err.message}`);
        }
        return undefined;
      },
    });

    optionToExitApp(modelPathInput);
    normalizedPath = path.resolve(modelPathInput as string);

    console.log(chalk.blue(`\nValidating directory depth and size (max ${VALIDATION_TIMEOUT_MS / 1000}s)...`));

    const validationPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const depth = getDirectoryDepth(normalizedPath);
        if (depth > MAX_DEPTH) {
          return reject(
            new Error(
              `❌ Directory depth (${depth}) exceeds the maximum of ${MAX_DEPTH} levels.`
            )
          );
        }
        const size = getDirectorySize(normalizedPath, MAX_SIZE_BYTES);
        if (size > MAX_SIZE_BYTES) {
          return reject(
            new Error(
              `❌ Directory size exceeds the maximum of ${MAX_SIZE_MB} MB.`
            )
          );
        }
        resolve();
      } catch (err) {
        reject(new Error(`❌ Validation failed: ${err.message}`));
      }
    });

    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(
        () => reject(new Error("❌ Validation timed out.")),
        VALIDATION_TIMEOUT_MS
      )
    );

    try {
      await Promise.race([validationPromise, timeoutPromise]);
      console.log(chalk.green(`✅ Directory validation passed.`));
      isValid = true;
    } catch (err) {
      if (err instanceof Error) {
        console.error(chalk.red(err.message));
      } else {
        console.error(chalk.red('❌ Validation failed with an unexpected error.'));
      }
      console.log(chalk.yellow("Please try again.\n"));
    }
  }

  return normalizedPath;
}

export async function getModelDescription(): Promise<string> {
  let description = await text({
    message: "Enter a description for your model:",
    placeholder: "This model is used for...",
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
