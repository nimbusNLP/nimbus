import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { deleteModel } from '../src/deleteModel';
import * as ui from '../src/utils/ui';
import * as deployment from '../src/utils/deployment';
import * as cli from '../src/utils/cli';
import * as fileSystem from '../src/utils/fileSystem';

// Mock dependencies
vi.mock('fs');
vi.mock('path', () => ({
  default: {
    join: (...args: string[]) => args.join('/'),
  },
}));
vi.mock('../src/utils/ui');
vi.mock('../src/utils/deployment');
vi.mock('../src/utils/cli');
vi.mock('../src/utils/fileSystem');

describe('deleteModel', () => {
  const mockNimbusLocalStoragePath = '/mock/nimbus/path';
  const mockFinishedDir = '/mock/nimbus/path/finished_dir';
  const mockModelsConfigPath = '/mock/nimbus/path/finished_dir/models.json';
  const mockCurrentDir = '/current/dir';

  beforeEach(() => {
    // Setup mocks
    vi.resetAllMocks();
    
    // Mock process.cwd
    vi.spyOn(process, 'cwd').mockReturnValue(mockCurrentDir);
    
    // Mock console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display welcome message when started', async () => {
    // Mock fs.existsSync to return false to exit early
    vi.mocked(fs.existsSync).mockReturnValue(false);
    
    await deleteModel(mockNimbusLocalStoragePath);
    
    expect(ui.displayDeleteWelcomeMessage).toHaveBeenCalled();
  });

  it('should exit early if finished_dir does not exist', async () => {
    // Mock fs.existsSync to return false
    vi.mocked(fs.existsSync).mockReturnValue(false);
    
    await deleteModel(mockNimbusLocalStoragePath);
    
    expect(console.log).toHaveBeenCalledWith('❌  No models found to delete.');
    expect(fileSystem.readModelsConfig).not.toHaveBeenCalled();
  });

  it('should exit early if models.json is empty', async () => {
    // Mock fs.existsSync to return true
    vi.mocked(fs.existsSync).mockReturnValue(true);
    
    // Mock readModelsConfig to return empty array
    vi.mocked(fileSystem.readModelsConfig).mockReturnValue([]);
    
    await deleteModel(mockNimbusLocalStoragePath);
    
    expect(console.log).toHaveBeenCalledWith('❌  No models found to delete.');
    expect(cli.selectModelToRemove).not.toHaveBeenCalled();
  });

  it('should proceed with deletion if a model is selected', async () => {
    // Mock fs.existsSync to return true
    vi.mocked(fs.existsSync).mockReturnValue(true);
    
    // Mock readModelsConfig to return models
    vi.mocked(fileSystem.readModelsConfig).mockReturnValue([
      { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: 'path1', description: 'desc1' },
      { modelName: 'model2', modelType: 'fine-tuned', modelPathOrName: 'path2', description: 'desc2' }
    ]);
    
    // Mock selectModelToRemove to return a model name
    vi.mocked(cli.selectModelToRemove).mockResolvedValue('model1');
    
    // Mock shouldRemoveModel to resolve (user confirms)
    vi.mocked(cli.shouldRemoveModel).mockResolvedValue(undefined);
    
    await deleteModel(mockNimbusLocalStoragePath);
    
    expect(cli.selectModelToRemove).toHaveBeenCalledWith(mockModelsConfigPath);
    expect(cli.shouldRemoveModel).toHaveBeenCalledWith('model1');
    expect(deployment.deleteModelFromStack).toHaveBeenCalledWith(
      mockCurrentDir,
      mockFinishedDir,
      'model1'
    );
    expect(ui.displayDeleteCompletionMessage).toHaveBeenCalled();
  });

  it('should not proceed with deletion if no model is selected', async () => {
    // Mock fs.existsSync to return true
    vi.mocked(fs.existsSync).mockReturnValue(true);
    
    // Mock readModelsConfig to return models
    vi.mocked(fileSystem.readModelsConfig).mockReturnValue([
      { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: 'path1', description: 'desc1' }
    ]);
    
    // Mock selectModelToRemove to return null (no selection)
    vi.mocked(cli.selectModelToRemove).mockResolvedValue(null);
    
    await deleteModel(mockNimbusLocalStoragePath);
    
    expect(cli.selectModelToRemove).toHaveBeenCalledWith(mockModelsConfigPath);
    expect(cli.shouldRemoveModel).not.toHaveBeenCalled();
    expect(deployment.deleteModelFromStack).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('❌  No model selected for deletion.');
  });
});
