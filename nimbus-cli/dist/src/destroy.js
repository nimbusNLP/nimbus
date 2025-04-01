import { destroyStack } from "./utils/deployment.js";
export async function destroy() {
    const currentDir = process.cwd();
    await destroyStack(currentDir);
}
