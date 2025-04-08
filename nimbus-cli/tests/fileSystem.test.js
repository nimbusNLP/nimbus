/**
 * Tests for file system operations in the Nimbus CLI
 */

// Mock the fs and path modules
jest.mock('fs');
jest.mock('path');

// Import modules
const fs = require('fs');
const path = require('path');
const fileSystem = require('../src/utils/fileSystem.js');

// Mock console.log and console.error
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('File System Operations', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    fs.__resetMockFileSystem();
  });

  describe('ensureDirectoryExists', () => {
    test('should create directory if it does not exist', () => {
      // Setup mock to indicate directory does not exist
      fs.existsSync.mockReturnValue(false);
      
      fileSystem.ensureDirectoryExists('/path/to/dir');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/dir');
      expect(fs.mkdirSync).toHaveBeenCalledWith('/path/to/dir', { recursive: true });
    });

    test('should not create directory if it already exists', () => {
      // Setup mock to indicate directory exists
      fs.existsSync.mockReturnValue(true);
      
      fileSystem.ensureDirectoryExists('/path/to/dir');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/dir');
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('initializeModelsConfig', () => {
    test('should create config file if it does not exist', () => {
      // Setup mock to indicate file does not exist
      fs.existsSync.mockReturnValue(false);
      
      fileSystem.initializeModelsConfig('/path/to/config.json');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/config.json');
      expect(fs.writeFileSync).toHaveBeenCalledWith('/path/to/config.json', JSON.stringify([]));
    });

    test('should not create config file if it already exists', () => {
      // Setup mock to indicate file exists
      fs.existsSync.mockReturnValue(true);
      
      fileSystem.initializeModelsConfig('/path/to/config.json');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/config.json');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('readModelsConfig', () => {
    test('should read and parse config file', () => {
      const mockConfig = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1', description: 'Model 1' },
        { modelName: 'model2', modelType: 'fine-tuned', modelPathOrName: 'model2-name', description: 'Model 2' }
      ];
      
      // Setup mock to return JSON string
      fs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
      
      const result = fileSystem.readModelsConfig('/path/to/config.json');
      
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/config.json', 'utf8');
      expect(result).toEqual(mockConfig);
    });
  });

  describe('updateModelsConfig', () => {
    test('should add new model to config and save file', () => {
      const existingModels = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1', description: 'Model 1' }
      ];
      
      const newModel = {
        modelName: 'model2',
        modelType: 'fine-tuned',
        modelPathOrName: 'model2-name',
        description: 'Model 2'
      };
      
      // Setup mock to return existing models
      fs.readFileSync.mockReturnValue(JSON.stringify(existingModels));
      
      fileSystem.updateModelsConfig('/path/to/config.json', newModel);
      
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/config.json', 'utf8');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/config.json',
        JSON.stringify([...existingModels, newModel], null, 2)
      );
    });
  });

  describe('removeModelFromConfig', () => {
    test('should remove model from config if it exists', () => {
      const existingModels = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1', description: 'Model 1' },
        { modelName: 'model2', modelType: 'fine-tuned', modelPathOrName: 'model2-name', description: 'Model 2' }
      ];
      
      // Setup mock to return existing models
      fs.readFileSync.mockReturnValue(JSON.stringify(existingModels));
      
      fileSystem.removeModelFromConfig('/path/to/config.json', 'model1');
      
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/config.json', 'utf8');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/config.json',
        JSON.stringify([existingModels[1]], null, 2)
      );
    });

    test('should not modify config if model does not exist', () => {
      const existingModels = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1', description: 'Model 1' }
      ];
      
      // Setup mock to return existing models
      fs.readFileSync.mockReturnValue(JSON.stringify(existingModels));
      
      fileSystem.removeModelFromConfig('/path/to/config.json', 'non-existent-model');
      
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/config.json', 'utf8');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('removeModelDirectory', () => {
    test('should remove directory if it exists', () => {
      // Setup mock to indicate directory exists
      fs.existsSync.mockReturnValue(true);
      path.join.mockImplementation((...args) => args.join('/'));
      
      fileSystem.removeModelDirectory('/base/dir', 'model1');
      
      expect(path.join).toHaveBeenCalledWith('/base/dir', 'model1');
      expect(fs.existsSync).toHaveBeenCalledWith('/base/dir/model1');
      expect(fs.rmSync).toHaveBeenCalledWith(
        '/base/dir/model1',
        { recursive: true, force: true }
      );
      expect(console.log).not.toHaveBeenCalled();
    });

    test('should log error if directory does not exist', () => {
      // Setup mock to indicate directory does not exist
      fs.existsSync.mockReturnValue(false);
      path.join.mockImplementation((...args) => args.join('/'));
      
      fileSystem.removeModelDirectory('/base/dir', 'model1');
      
      expect(path.join).toHaveBeenCalledWith('/base/dir', 'model1');
      expect(fs.existsSync).toHaveBeenCalledWith('/base/dir/model1');
      expect(fs.rmSync).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('❌  Model directory "model1" does not exist.');
    });
  });

  describe('copyModelDirectory', () => {
    test('should copy directory successfully', () => {
      fileSystem.copyModelDirectory('/source/dir', '/dest/dir');
      
      expect(fs.cpSync).toHaveBeenCalledWith('/source/dir', '/dest/dir', { recursive: true });
      expect(console.error).not.toHaveBeenCalled();
    });

    test('should throw error if copy fails', () => {
      const mockError = new Error('Copy failed');
      
      // Setup mock to throw error
      fs.cpSync.mockImplementation(() => {
        throw mockError;
      });
      
      expect(() => fileSystem.copyModelDirectory('/source/dir', '/dest/dir')).toThrow(mockError);
      
      expect(fs.cpSync).toHaveBeenCalledWith('/source/dir', '/dest/dir', { recursive: true });
      expect(console.error).toHaveBeenCalledWith('❌  Error copying model directory:', mockError);
    });
  });

  describe('deleteFinishedDir', () => {
    test('should remove finished_dir if it exists', () => {
      // Setup mock to indicate directory exists
      fs.existsSync.mockReturnValue(true);
      path.join.mockImplementation((...args) => args.join('/'));
      
      fileSystem.deleteFinishedDir('/base/dir');
      
      expect(path.join).toHaveBeenCalledWith('/base/dir', 'finished_dir');
      expect(fs.existsSync).toHaveBeenCalledWith('/base/dir/finished_dir');
      expect(fs.rmSync).toHaveBeenCalledWith(
        '/base/dir/finished_dir',
        { recursive: true, force: true }
      );
    });

    test('should not attempt to remove if directory does not exist', () => {
      // Setup mock to indicate directory does not exist
      fs.existsSync.mockReturnValue(false);
      path.join.mockImplementation((...args) => args.join('/'));
      
      fileSystem.deleteFinishedDir('/base/dir');
      
      expect(path.join).toHaveBeenCalledWith('/base/dir', 'finished_dir');
      expect(fs.existsSync).toHaveBeenCalledWith('/base/dir/finished_dir');
      expect(fs.rmSync).not.toHaveBeenCalled();
    });
  });

  describe('writeModelFiles', () => {
    test('should write all model files correctly', () => {
      const modelDir = '/path/to/model';
      const requirementsContent = 'numpy==1.21.0';
      const dockerFileContent = 'FROM python:3.9';
      const lambdaFunctionContent = 'def handler(event, context): pass';
      const modelDescription = 'Test model description';
      
      path.join.mockImplementation((...args) => args.join('/'));
      
      fileSystem.writeModelFiles(
        modelDir,
        requirementsContent,
        dockerFileContent,
        lambdaFunctionContent,
        modelDescription
      );
      
      expect(fs.writeFileSync).toHaveBeenCalledTimes(4);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/model/requirements.txt',
        requirementsContent
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/model/Dockerfile',
        dockerFileContent
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/model/lambda_function.py',
        lambdaFunctionContent
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/model/description.txt',
        modelDescription
      );
    });
  });
});
