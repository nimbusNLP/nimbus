import * as deploymentUtils from '../utils/deployment';
import { exec } from 'child_process';
import { promisify } from 'util';

jest.mock('util', () => ({
  promisify: jest.fn(),
}));

const mockExecPromise = jest.fn();
(promisify as unknown as jest.Mock).mockReturnValue(mockExecPromise);

describe('deployment.ts', () => {
  const mockCurrentDir = '/mock/currentDir';
  const mockFinishedDirPath = '/mock/finishedDir';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should deploy API Gateway', async () => {
    mockExecPromise.mockResolvedValue({ stderr: 'ApiGatewayStack.RestApiUrl = https://mock-api.com' });

    await deploymentUtils.deployApiGateway(mockCurrentDir, mockFinishedDirPath);

    expect(mockExecPromise).toHaveBeenCalledWith(
      `cdk deploy ApiGatewayStack --require-approval never -c finishedDirPath="${mockFinishedDirPath}"`,
      { cwd: `${mockCurrentDir}/../nimbus-cdk` }
    );
  });

  it('should throw an error if API Gateway deployment fails', async () => {
    mockExecPromise.mockRejectedValue(new Error('Deployment failed'));

    await expect(deploymentUtils.deployApiGateway(mockCurrentDir, mockFinishedDirPath)).rejects.toThrow('Deployment failed');
  });

  it('should destroy the stack', async () => {
    mockExecPromise.mockResolvedValue({});

    await deploymentUtils.destroyStack(mockCurrentDir, mockFinishedDirPath);

    expect(mockExecPromise).toHaveBeenCalledWith(
      `cdk destroy ApiGatewayStack --force -c finishedDirPath="${mockFinishedDirPath}"`,
      { cwd: `${mockCurrentDir}/../nimbus-cdk` }
    );
  });
});