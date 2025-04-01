import { select, isCancel, cancel, note, confirm } from '@clack/prompts';
import { readModelsConfig } from './fileSystem.js';
export async function shouldDeployApiGateway() {
    const deployChoice = await select({
        message: 'Do you want to deploy the API Gateway?',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
        ],
    });
    if (isCancel(deployChoice) || deployChoice === 'no') {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return deployChoice === 'yes';
}
export async function shouldDeployModel() {
    const deployModelChoice = await select({
        message: 'Are you ready to deploy a model?',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
        ],
    });
    if (isCancel(deployModelChoice) || deployModelChoice === 'no') {
        console.log('No model deployed.');
        process.exit(0);
    }
    return deployModelChoice === 'yes';
}
export async function shouldRemoveModel() {
    const removeModelChoice = await select({
        message: 'Are you sure you want to remove a model?',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
        ],
    });
    if (isCancel(removeModelChoice) || removeModelChoice === 'no') {
        cancel('Operation cancelled.');
        process.exit(0);
    }
}
export async function selectModelToRemove(modelsConfigPath) {
    const models = readModelsConfig(modelsConfigPath);
    if (models.length === 0) {
        note('No models found in configuration to remove.', 'Error');
        process.exit(0);
    }
    const options = models.map(model => ({
        value: model.modelName,
        label: `${model.modelName} (${model.modelType})`,
        hint: model.description || (model.modelType === 'pre-trained' ? model.modelPathOrName : 'Fine-tuned model')
    }));
    const selectedModel = await select({
        message: 'Which model would you like to remove?',
        options: options,
    });
    if (isCancel(selectedModel)) {
        process.exit(0);
    }
    const shouldRemove = await confirm({
        message: `Are you sure you want to remove the model "${selectedModel}"? This will delete its cloud resources.`,
    });
    if (isCancel(shouldRemove) || !shouldRemove) {
        cancel('Model removal cancelled.');
        process.exit(0);
    }
    return selectedModel;
}
