import { shouldDestroyStack } from "./utils/cli.js";
import { destroyStack } from "./utils/deployment.js";
import { deleteFinishedDir } from "./utils/fileSystem.js";
import path from 'path';

export async function destroy(nimbusLocalStoragePath: string) {
  await shouldDestroyStack();
  const currentDir = process.cwd();
  const finishedDirPath = path.join(nimbusLocalStoragePath, 'finished_dir');
  
  await destroyStack(currentDir, finishedDirPath);
  deleteFinishedDir(nimbusLocalStoragePath);  
} 