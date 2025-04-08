import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the dependencies
vi.mock('@clack/prompts', () => ({
  isCancel: vi.fn(),
  cancel: vi.fn()
}));

vi.mock('../../src/utils/fileSystem.js', () => ({
  readModelsConfig: vi.fn()
}));

// Import mocked modules
import { isCancel, cancel } from '@clack/prompts';
import { readModelsConfig } from '../../src/utils/fileSystem.js';

// Mock process.exit to prevent tests from actually exiting
const mockExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`Process.exit called with code: ${code}`);
});

// Import the functions to test after mocking
import { validModelName, modelNameNotUnique, isSafeDescription, optionToExitApp } from '../../src/utils/validation.js';

describe('Validation Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.resetAllMocks();
  });

  describe('validModelName', () => {
    it('should return false for empty or non-string inputs', () => {
      expect(validModelName('', 'config-path')).toBe(false);
      expect(validModelName('   ', 'config-path')).toBe(false);
      expect(validModelName(Symbol('test') as any, 'config-path')).toBe(false);
    });

    it('should return false for invalid model name format', () => {
      expect(validModelName('123model', 'config-path')).toBe(false); // Starts with number
      expect(validModelName('Model', 'config-path')).toBe(false); // Contains uppercase
      expect(validModelName('model-name', 'config-path')).toBe(false); // Contains hyphen
      expect(validModelName('model_name', 'config-path')).toBe(false); // Contains underscore
    });

    it('should return false if model name already exists', () => {
      // Setup mock to return a model with the same name
      (readModelsConfig as any).mockReturnValue([
        { modelName: 'existingmodel' }
      ]);
      
      expect(validModelName('existingmodel', 'config-path')).toBe(false);
      expect(readModelsConfig).toHaveBeenCalledWith('config-path');
    });

    it('should return true for valid and unique model names', () => {
      // Setup mock to return models with different names
      (readModelsConfig as any).mockReturnValue([
        { modelName: 'othermodel1' },
        { modelName: 'othermodel2' }
      ]);
      
      expect(validModelName('validmodel', 'config-path')).toBe(true);
      expect(readModelsConfig).toHaveBeenCalledWith('config-path');
    });
  });

  describe('modelNameNotUnique', () => {
    it('should return true if model name exists', () => {
      // Setup mock to return a model with the same name
      (readModelsConfig as any).mockReturnValue([
        { modelName: 'existingmodel' },
        { modelName: 'othermodel' }
      ]);
      
      expect(modelNameNotUnique('existingmodel', 'config-path')).toBe(true);
      expect(readModelsConfig).toHaveBeenCalledWith('config-path');
    });

    it('should return false if model name does not exist', () => {
      // Setup mock to return models with different names
      (readModelsConfig as any).mockReturnValue([
        { modelName: 'othermodel1' },
        { modelName: 'othermodel2' }
      ]);
      
      expect(modelNameNotUnique('newmodel', 'config-path')).toBe(false);
      expect(readModelsConfig).toHaveBeenCalledWith('config-path');
    });
  });

  describe('isSafeDescription', () => {
    it('should return true for undefined description', () => {
      expect(isSafeDescription(undefined as any)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isSafeDescription('')).toBe(true);
    });

    it('should return true for valid descriptions', () => {
      expect(isSafeDescription('A valid description')).toBe(true);
      expect(isSafeDescription('Description with numbers 123')).toBe(true);
      expect(isSafeDescription('Description with symbols !@#%&*()[]{}.,?')).toBe(true);
    });

    it('should return false for descriptions with HTML tags', () => {
      expect(isSafeDescription('Description with <tag>')).toBe(false);
      expect(isSafeDescription('Description with </tag>')).toBe(false);
    });

    it('should return false for descriptions with control characters', () => {
      expect(isSafeDescription('Description with \x00 control char')).toBe(false);
      expect(isSafeDescription('Description with \x1F control char')).toBe(false);
    });

    it('should return false for descriptions with dangerous shell characters', () => {
      expect(isSafeDescription('Description with $ char')).toBe(false);
      expect(isSafeDescription('Description with ` char')).toBe(false);
      expect(isSafeDescription('Description with ; char')).toBe(false);
    });

    it('should return false for descriptions longer than 200 characters', () => {
      const longDescription = 'a'.repeat(201);
      expect(isSafeDescription(longDescription)).toBe(false);
    });
  });

  describe('optionToExitApp', () => {
    it('should exit if input is cancelled', () => {
      // Setup mock to indicate cancellation
      (isCancel as any).mockReturnValue(true);
      
      try {
        optionToExitApp('some-input');
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Process.exit called with code: 0');
      }
      
      expect(isCancel).toHaveBeenCalledWith('some-input');
      expect(cancel).toHaveBeenCalledWith('Operation cancelled.');
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('should not exit if input is not cancelled', () => {
      // Setup mock to indicate no cancellation
      (isCancel as any).mockReturnValue(false);
      
      optionToExitApp('some-input');
      
      expect(isCancel).toHaveBeenCalledWith('some-input');
      expect(cancel).not.toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
