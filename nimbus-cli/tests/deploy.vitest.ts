import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { deploy } from '../src/deploy';
import * as ui from '../src/utils/ui';
import * as deployment from '../src/utils/deployment';
import * as cli from '../src/utils/cli';
import * as model from '../src/utils/model';
import * as fileSystem from '../src/utils/fileSystem';
import path from 'path';
import fs from 'fs';

// Mock all dependencies
vi.mock('path', () => ({
  default: {
    join: vi.fn((...args) => args.join('/')),
  },
}));

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
  },
}));

vi.mock('../src/utils/ui', () => ({
  displayWelcomeMessage: vi.fn(),
  displayCompletionMessage: vi.fn(),
}));

vi.mock('../src/utils/deployment', () => ({
  deployUpdatedStack: vi.fn(),
}));

vi.mock('../src/utils/cli', () => ({
  shouldDeployModel: vi.fn(),
}));

vi.mock('../src/utils/model', () => ({
  getModelType: vi.fn(),
  getModelName: vi.fn(),
  getPreTrainedModel: vi.fn(),
  getFineTunedModelPath: vi.fn(),
  generateModelFiles: vi.fn(),
  getModelDescription: vi.fn(),
}));

vi.mock('../src/utils/fileSystem', () => ({
  ensureDirectoryExists: vi.fn(),
  initializeModelsConfig: vi.fn(),
  updateModelsConfig: vi.fn(),
  copyModelDirectory: vi.fn(),
}));

describe('deploy', () => {
  const mockNimbusLocalStoragePath = '/mock/storage/path';
  const mockCurrentDir = '/mock/current/dir';
  const mockFinishedDir = '/mock/storage/path/finished_dir';
  const mockModelsConfigPath = '/mock/storage/path/finished_dir/models.json';
  const mockModelName = 'test-model';
  const mockModelDir = '/mock/storage/path/finished_dir/test-model';
  const mockModelDescription = 'Test model description';

  beforeEach(() => {
    // Set up process.cwd mock
    vi.spyOn(process, 'cwd').mockReturnValue(mockCurrentDir);
    
    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize directories and config', async () => {
    // Mock shouldDeployModel to return false to exit early
    vi.mocked(cli.shouldDeployModel).mockResolvedValue(false);

    await deploy(mockNimbusLocalStoragePath);

    // Verify directory and config initialization
    expect(fileSystem.ensureDirectoryExists).toHaveBeenCalledWith(mockNimbusLocalStoragePath);
    expect(fileSystem.ensureDirectoryExists).toHaveBeenCalledWith(mockFinishedDir);
    expect(fileSystem.initializeModelsConfig).toHaveBeenCalledWith(mockModelsConfigPath);
    expect(ui.displayWelcomeMessage).toHaveBeenCalled();
  });

  it('should exit early if user chooses not to deploy', async () => {
    // Mock shouldDeployModel to return false
    vi.mocked(cli.shouldDeployModel).mockResolvedValue(false);

    await deploy(mockNimbusLocalStoragePath);

    // Verify early exit
    expect(model.getModelType).not.toHaveBeenCalled();
    expect(deployment.deployUpdatedStack).not.toHaveBeenCalled();
  });

  it('should deploy a pre-trained model', async () => {
    // Mock all required functions
    vi.mocked(cli.shouldDeployModel).mockResolvedValue(true);
    vi.mocked(model.getModelType).mockResolvedValue('pre-trained');
    vi.mocked(model.getModelName).mockResolvedValue(mockModelName);
    vi.mocked(model.getModelDescription).mockResolvedValue(mockModelDescription);
    vi.mocked(model.getPreTrainedModel).mockResolvedValue('en_core_web_sm');

    await deploy(mockNimbusLocalStoragePath);

    // Verify pre-trained model deployment
    expect(model.getPreTrainedModel).toHaveBeenCalled();
    expect(model.getFineTunedModelPath).not.toHaveBeenCalled();
    expect(fileSystem.copyModelDirectory).not.toHaveBeenCalled();
    expect(model.generateModelFiles).toHaveBeenCalledWith(
      'pre-trained', 
      'en_core_web_sm', 
      mockModelDir, 
      mockModelDescription
    );
    expect(fileSystem.updateModelsConfig).toHaveBeenCalledWith(
      mockModelsConfigPath,
      {
        modelName: mockModelName,
        modelType: 'pre-trained',
        modelPathOrName: 'en_core_web_sm',
        description: mockModelDescription,
      }
    );
    expect(deployment.deployUpdatedStack).toHaveBeenCalledWith(
      mockCurrentDir,
      mockFinishedDir,
      mockModelName,
      mockModelDir
    );
    expect(ui.displayCompletionMessage).toHaveBeenCalled();
  });

  it('should deploy a fine-tuned model', async () => {
    // Mock all required functions
    vi.mocked(cli.shouldDeployModel).mockResolvedValue(true);
    vi.mocked(model.getModelType).mockResolvedValue('fine-tuned');
    vi.mocked(model.getModelName).mockResolvedValue(mockModelName);
    vi.mocked(model.getModelDescription).mockResolvedValue(mockModelDescription);
    vi.mocked(model.getFineTunedModelPath).mockResolvedValue('/path/to/fine-tuned/model');

    await deploy(mockNimbusLocalStoragePath);

    // Verify fine-tuned model deployment
    expect(model.getPreTrainedModel).not.toHaveBeenCalled();
    expect(model.getFineTunedModelPath).toHaveBeenCalled();
    expect(fileSystem.copyModelDirectory).toHaveBeenCalledWith(
      '/path/to/fine-tuned/model',
      path.join(mockModelDir, 'model-best')
    );
    expect(model.generateModelFiles).toHaveBeenCalledWith(
      'fine-tuned', 
      '/path/to/fine-tuned/model', 
      mockModelDir, 
      mockModelDescription
    );
    expect(fileSystem.updateModelsConfig).toHaveBeenCalledWith(
      mockModelsConfigPath,
      {
        modelName: mockModelName,
        modelType: 'fine-tuned',
        modelPathOrName: '/path/to/fine-tuned/model',
        description: mockModelDescription,
      }
    );
    expect(deployment.deployUpdatedStack).toHaveBeenCalledWith(
      mockCurrentDir,
      mockFinishedDir,
      mockModelName,
      mockModelDir
    );
    expect(ui.displayCompletionMessage).toHaveBeenCalled();
  });

  it('should handle empty model description', async () => {
    // Mock all required functions
    vi.mocked(cli.shouldDeployModel).mockResolvedValue(true);
    vi.mocked(model.getModelType).mockResolvedValue('pre-trained');
    vi.mocked(model.getModelName).mockResolvedValue(mockModelName);
    vi.mocked(model.getModelDescription).mockResolvedValue(''); 
    vi.mocked(model.getPreTrainedModel).mockResolvedValue('en_core_web_sm');

    await deploy(mockNimbusLocalStoragePath);

    // Verify deployment with empty description
    expect(fileSystem.updateModelsConfig).toHaveBeenCalledWith(
      mockModelsConfigPath,
      {
        modelName: mockModelName,
        modelType: 'pre-trained',
        modelPathOrName: 'en_core_web_sm',
        description: '', 
      }
    );
  });
});
