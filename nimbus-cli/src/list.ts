import path from "path";
import fs from "fs";

export interface ModelDataType {
  modelName: string;
  modelType: string;
  modelPathOrName: string;
  description: string;
}

export function listModels() {
  const currentDir = process.cwd();
  const finishedDir = path.join(currentDir, 'finished_dir');
  const modelsConfigPath = path.join(finishedDir, 'models.json');

  try {
    const data = fs.readFileSync(modelsConfigPath, 'utf8');
    const json: ModelDataType[] = JSON.parse(data);
    
    if (json.length === 0) {
      console.log('No models deployed yet.');
      return;
    }

    console.log('\nDeployed Models:');
    console.log('---------------');
    json.forEach(modelData => {
      console.log(`- ${modelData.modelName} (${modelData.modelType})`);
      console.log(`  Description: ${modelData.description}`);
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('No models deployed yet. Use "nimbus deploy" to deploy your first model.');
    } else {
      console.error('Error reading models configuration:', error);
    }
  }
}
