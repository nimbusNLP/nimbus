import { destroyStack } from "./utils/deployment.js";
import { deleteFinishedDir } from "./utils/fileSystem.js";
export async function destroy() {
    const currentDir = process.cwd();
    await destroyStack(currentDir);
    deleteFinishedDir(currentDir);
}
