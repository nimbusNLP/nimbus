import { destroyStack } from "./utils/deployment.js";
import { deleteFinishedDir } from "./utils/fileSystem.js";
import path from "path";
export async function destroy(nimbusLocalStoragePath) {
  const currentDir = process.cwd();
  const finishedDirPath = path.join(nimbusLocalStoragePath, "finished_dir");
  await destroyStack(currentDir, finishedDirPath);
  deleteFinishedDir(finishedDirPath);
}
