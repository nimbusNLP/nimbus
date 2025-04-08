import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// Mock the fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  rmSync: jest.fn(),
  cpSync: jest.fn()
}));

// Mock console.log and console.error
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Import the functions to test
import {
  ensureDirectoryExists,
  initializeModelsConfig,
  readModelsConfig,
  updateModelsConfig,
  removeModelFromConfig,
  removeModelDirectory,
  copyModelDirectory,
  deleteFinishedDir,
  writeModelFiles,
  ModelConfig
} from '../../src/utils/fileSystem.js';

describe('FileSystem Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('ensureDirectoryExists', () => {
    it('should create directory if it does not exist', () => {
      // Setup mock to indicate directory does not exist
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      ensureDirectoryExists('/path/to/dir');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/dir');
      expect(fs.mkdirSync).toHaveBeenCalledWith('/path/to/dir', { recursive: true });
    });

    it('should not create directory if it already exists', () => {
      // Setup mock to indicate directory exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      ensureDirectoryExists('/path/to/dir');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/dir');
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('initializeModelsConfig', () => {
    it('should create config file if it does not exist', () => {
      // Setup mock to indicate file does not exist
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      initializeModelsConfig('/path/to/config.json');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/config.json');
      expect(fs.writeFileSync).toHaveBeenCalledWith('/path/to/config.json', JSON.stringify([]));
    });

    it('should not create config file if it already exists', () => {
      // Setup mock to indicate file exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      initializeModelsConfig('/path/to/config.json');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/config.json');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('readModelsConfig', () => {
    it('should read and parse config file', () => {
      const mockConfig = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1', description: 'Model 1' },
        { modelName: 'model2', modelType: 'fine-tuned', modelPathOrName: 'model2-name', description: 'Model 2' }
      ];
      
      // Setup mock to return JSON string
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockConfig));
      
      const result = readModelsConfig('/path/to/config.json');
      
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/config.json', 'utf8');
      expect(result).toEqual(mockConfig);
    });
  });

  describe('updateModelsConfig', () => {
    it('should add new model to config and save file', () => {
      const existingModels = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1', description: 'Model 1' }
      ];
      
      const newModel = {
        modelName: 'model2',
        modelType: 'fine-tuned',
        modelPathOrName: 'model2-name',
        description: 'Model 2'
      } as ModelConfig;
      
      // Setup mock to return existing models
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(existingModels));
      
      updateModelsConfig('/path/to/config.json', newModel);
      
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/config.json', 'utf8');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/config.json',
        JSON.stringify([...existingModels, newModel], null, 2)
      );
    });
  });

  describe('removeModelFromConfig', () => {
    it('should remove model from config if it exists', () => {
      const existingModels = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1', description: 'Model 1' },
        { modelName: 'model2', modelType: 'fine-tuned', modelPathOrName: 'model2-name', description: 'Model 2' }
      ];
      
      // Setup mock to return existing models
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(existingModels));
      
      removeModelFromConfig('/path/to/config.json', 'model1');
      
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/config.json', 'utf8');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/config.json',
        JSON.stringify([existingModels[1]], null, 2)
      );
    });

    it('should not modify config if model does not exist', () => {
      const existingModels = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1', description: 'Model 1' }
      ];
      
      // Setup mock to return existing models
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(existingModels));
      
      removeModelFromConfig('/path/to/config.json', 'non-existent-model');
      
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/config.json', 'utf8');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('removeModelDirectory', () => {
    it('should remove directory if it exists', () => {
      // Setup mock to indicate directory exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      removeModelDirectory('/base/dir', 'model1');
      
      expect(fs.existsSync).toHaveBeenCalledWith(path.join('/base/dir', 'model1'));
      expect(fs.rmSync).toHaveBeenCalledWith(
        path.join('/base/dir', 'model1'),
        { recursive: true, force: true }
      );
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should log error if directory does not exist', () => {
      // Setup mock to indicate directory does not exist
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      removeModelDirectory('/base/dir', 'model1');
      
      expect(fs.existsSync).toHaveBeenCalledWith(path.join('/base/dir', 'model1'));
      expect(fs.rmSync).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('❌  Model directory "model1" does not exist.');
    });
  });

  describe('copyModelDirectory', () => {
    it('should copy directory successfully', () => {
      copyModelDirectory('/source/dir', '/dest/dir');
      
      expect(fs.cpSync).toHaveBeenCalledWith('/source/dir', '/dest/dir', { recursive: true });
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should throw error if copy fails', () => {
      const mockError = new Error('Copy failed');
      
      // Setup mock to throw error
      (fs.cpSync as jest.Mock).mockImplementation(() => {
        throw mockError;
      });
      
      expect(() => copyModelDirectory('/source/dir', '/dest/dir')).toThrow(mockError);
      
      expect(fs.cpSync).toHaveBeenCalledWith('/source/dir', '/dest/dir', { recursive: true });
      expect(console.error).toHaveBeenCalledWith('❌  Error copying model directory:', mockError);
    });
  });

  describe('deleteFinishedDir', () => {
    it('should remove finished_dir if it exists', () => {
      // Setup mock to indicate directory exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      deleteFinishedDir('/base/dir');
      
      expect(fs.existsSync).toHaveBeenCalledWith(path.join('/base/dir', 'finished_dir'));
      expect(fs.rmSync).toHaveBeenCalledWith(
        path.join('/base/dir', 'finished_dir'),
        { recursive: true, force: true }
      );
    });

    it('should not attempt to remove if directory does not exist', () => {
      // Setup mock to indicate directory does not exist
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      deleteFinishedDir('/base/dir');
      
      expect(fs.existsSync).toHaveBeenCalledWith(path.join('/base/dir', 'finished_dir'));
      expect(fs.rmSync).not.toHaveBeenCalled();
    });
  });

  describe('writeModelFiles', () => {
    it('should write all model files correctly', () => {
      const modelDir = '/path/to/model';
      const requirementsContent = 'numpy==1.21.0';
      const dockerFileContent = 'FROM python:3.9';
      const lambdaFunctionContent = 'def handler(event, context): pass';
      const modelDescription = 'Test model description';
      
      writeModelFiles(
        modelDir,
        requirementsContent,
        dockerFileContent,
        lambdaFunctionContent,
        modelDescription
      );
      
      expect(fs.writeFileSync).toHaveBeenCalledTimes(4);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(modelDir, 'requirements.txt'),
        requirementsContent
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(modelDir, 'Dockerfile'),
        dockerFileContent
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(modelDir, 'lambda_function.py'),
        lambdaFunctionContent
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(modelDir, 'description.txt'),
        modelDescription
      );
    });
  });
});
