import { shouldDestroyStack } from "./utils/cli.js";
import { destroyStack } from "./utils/deployment.js";
import { deleteFinishedDir } from "./utils/fileSystem.js";
import { displayDestroyWelcomeMessage, displayDestroyCompletionMessage } from "./utils/ui.js";
import path from "path";
import * as fs from 'fs';


export async function destroy(nimbusLocalStoragePath: string) {
  displayDestroyWelcomeMessage();
  
  await shouldDestroyStack();
  const currentDir = process.cwd();
  const finishedDirPath = path.join(nimbusLocalStoragePath, "finished_dir");

  if (!fs.existsSync(finishedDirPath)) {
    console.log("❌  There is nothing to delete.");
    return;
  }

  await destroyStack(currentDir, finishedDirPath);
  deleteFinishedDir(nimbusLocalStoragePath);
  
  displayDestroyCompletionMessage();
} 