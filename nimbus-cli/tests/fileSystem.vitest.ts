/**
 * Vitest version of file system tests
 * This shows how your TypeScript tests would work with Vitest
 */

// With Vitest, you can use ES modules and TypeScript directly
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  ensureDirectoryExists,
  readModelsConfig,
  updateModelsConfig,
  removeModelFromConfig,
  removeModelDirectory,
  ModelConfig
} from '../src/utils/fileSystem.js';
import fs from 'fs';
import path from 'path';

// Mock fs module with proper typing
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    default: {
      existsSync: vi.fn(),
      mkdirSync: vi.fn(),
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
      rmSync: vi.fn()
    }
  };
});

// Mock path module
vi.mock('path', async () => {
  const actual = await vi.importActual('path');
  return {
    default: {
      join: vi.fn((...args) => args.join('/'))
    }
  };
});

describe('File System Utilities', () => {
  const testStoragePath = '/test/nimbus';
  const testModelName = 'testmodel';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('ensureDirectoryExists', () => {
    it('should create directory if it does not exist', () => {
      (fs.existsSync as any).mockReturnValue(false);
      
      ensureDirectoryExists(testStoragePath);
      
      expect(fs.existsSync).toHaveBeenCalledWith(testStoragePath);
      expect(fs.mkdirSync).toHaveBeenCalledWith(testStoragePath, { recursive: true });
    });
    
    it('should not create directory if it already exists', () => {
      (fs.existsSync as any).mockReturnValue(true);
      
      ensureDirectoryExists(testStoragePath);
      
      expect(fs.existsSync).toHaveBeenCalledWith(testStoragePath);
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });
  
  describe('readModelsConfig', () => {
    it('should return parsed JSON from file', () => {
      const mockConfig = [{ modelName: 'model1' }, { modelName: 'model2' }];
      (fs.readFileSync as any).mockReturnValue(JSON.stringify(mockConfig));
      
      const result = readModelsConfig(testStoragePath);
      
      expect(result).toEqual(mockConfig);
      expect(fs.readFileSync).toHaveBeenCalledWith(testStoragePath, 'utf8');
    });
  });
  
  describe('updateModelsConfig', () => {
    it('should add new model to config', () => {
      const existingConfig = [{ modelName: 'model1' }];
      const newModel: ModelConfig = { 
        modelName: 'model2',
        modelType: 'pre-trained',
        modelPathOrName: 'path/to/model',
        description: 'Test model'
      };
      (fs.readFileSync as any).mockReturnValue(JSON.stringify(existingConfig));
      
      updateModelsConfig(testStoragePath, newModel);
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        testStoragePath,
        JSON.stringify([...existingConfig, newModel], null, 2)
      );
    });
  });
  
  describe('removeModelFromConfig', () => {
    it('should remove model from config if it exists', () => {
      const existingConfig = [
        { modelName: 'model1' },
        { modelName: 'model2' }
      ];
      (fs.readFileSync as any).mockReturnValue(JSON.stringify(existingConfig));
      
      removeModelFromConfig(testStoragePath, 'model1');
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        testStoragePath,
        JSON.stringify([{ modelName: 'model2' }], null, 2)
      );
    });
    
    it('should not modify config if model does not exist', () => {
      const existingConfig = [{ modelName: 'model1' }];
      (fs.readFileSync as any).mockReturnValue(JSON.stringify(existingConfig));
      
      removeModelFromConfig(testStoragePath, 'nonexistent');
      
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });
  
  describe('removeModelDirectory', () => {
    it('should remove model directory if it exists', () => {
      (fs.existsSync as any).mockReturnValue(true);
      (path.join as any).mockImplementation((...args) => args.join('/'));
      
      removeModelDirectory(testStoragePath, testModelName);
      
      expect(path.join).toHaveBeenCalledWith(testStoragePath, testModelName);
      expect(fs.rmSync).toHaveBeenCalledWith(`${testStoragePath}/${testModelName}`, { 
        recursive: true, 
        force: true 
      });
    });
    
    it('should not attempt to remove directory if it does not exist', () => {
      (fs.existsSync as any).mockReturnValue(false);
      (path.join as any).mockImplementation((...args) => args.join('/'));
      
      removeModelDirectory(testStoragePath, testModelName);
      
      expect(fs.rmSync).not.toHaveBeenCalled();
    });
  });
});