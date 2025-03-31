import { select, isCancel, cancel } from '@clack/prompts';
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
