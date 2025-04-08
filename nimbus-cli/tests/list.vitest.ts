import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { listModels, ModelDataType } from '../src/list';

// Mock dependencies
vi.mock('fs');
vi.mock('path', () => ({
  default: {
    join: (...args: string[]) => args.join('/'),
  },
}));

describe('listModels', () => {
  const mockNimbusLocalStoragePath = '/mock/nimbus/path';
  const mockFinishedDir = '/mock/nimbus/path/finished_dir';
  const mockModelsConfigPath = '/mock/nimbus/path/finished_dir/models.json';
  const mockCurrentDir = '/current/dir';
  const mockOutputsPath = '/current/dir/../nimbus-cdk/outputs.json';
  
  // Mock models data
  const mockModels: ModelDataType[] = [
    {
      modelName: 'model1',
      modelType: 'pre-trained',
      modelPathOrName: '/path/to/model1',
      description: 'Test model 1'
    },
    {
      modelName: 'model2',
      modelType: 'fine-tuned',
      modelPathOrName: '/path/to/model2',
      description: 'Test model 2'
    }
  ];
  
  // Mock API URL
  const mockApiUrl = 'https://api.example.com/';
  const mockOutputsData = {
    ApiGatewayStack: {
      RestApiUrl: mockApiUrl
    }
  };

  beforeEach(() => {
    // Setup mocks
    vi.resetAllMocks();
    
    // Mock process.cwd
    vi.spyOn(process, 'cwd').mockReturnValue(mockCurrentDir);
    
    // Mock console.log and console.error
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display all deployed models with their endpoints', () => {
    // Mock fs.readFileSync for models.json
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => JSON.stringify(mockModels));
    
    // Mock fs.readFileSync for outputs.json
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => JSON.stringify(mockOutputsData));
    
    listModels(mockNimbusLocalStoragePath);
    
    // Verify console output
    expect(console.log).toHaveBeenCalledWith('\nDeployed Models:');
    expect(console.log).toHaveBeenCalledWith('---------------');
    
    // Check model1 output
    expect(console.log).toHaveBeenCalledWith(`- model1 (pre-trained) - ${mockApiUrl}model1/predict`);
    expect(console.log).toHaveBeenCalledWith('  Description: Test model 1');
    
    // Check model2 output
    expect(console.log).toHaveBeenCalledWith(`- model2 (fine-tuned) - ${mockApiUrl}model2/predict`);
    expect(console.log).toHaveBeenCalledWith('  Description: Test model 2');
  });

  it('should display a message when no models are deployed', () => {
    // Mock fs.readFileSync for models.json to return empty array
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => JSON.stringify([]));
    
    listModels(mockNimbusLocalStoragePath);
    
    expect(console.log).toHaveBeenCalledWith('No models deployed yet.');
    
    // Verify that it doesn't try to read outputs.json
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
  });

  it('should handle ENOENT error when models.json does not exist', () => {
    // Mock fs.readFileSync to throw ENOENT error
    const error = new Error('File not found') as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      throw error;
    });
    
    listModels(mockNimbusLocalStoragePath);
    
    expect(console.log).toHaveBeenCalledWith(
      'No models deployed yet. Use "nimbus deploy" to deploy your first model.'
    );
  });

  it('should handle other errors when reading models.json', () => {
    // Mock fs.readFileSync to throw a generic error
    const error = new Error('Unknown error');
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      throw error;
    });
    
    listModels(mockNimbusLocalStoragePath);
    
    expect(console.error).toHaveBeenCalledWith('❌ Error reading models configuration:', error);
  });
});
