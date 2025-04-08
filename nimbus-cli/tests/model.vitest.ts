/**
 * Tests for model utility functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as modelUtils from '../src/utils/model';
import * as validation from '../src/utils/validation';
import * as fileSystem from '../src/utils/fileSystem';

// Mock the fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(),
  readFileSync: vi.fn()
}));

// Mock the @clack/prompts module
vi.mock('@clack/prompts', () => ({
  select: vi.fn().mockResolvedValue('pre-trained'),
  text: vi.fn().mockResolvedValue('test-model')
}));

// Mock the validation module
vi.mock('../src/utils/validation.js', () => ({
  validModelName: vi.fn().mockReturnValue(true),
  modelNameNotUnique: vi.fn().mockReturnValue(false),
  isSafeDescription: vi.fn().mockReturnValue(true),
  optionToExitApp: vi.fn()
}));

// Mock the fileSystem module
vi.mock('../src/utils/fileSystem.js', () => ({
  writeModelFiles: vi.fn()
}));

// Mock the dockerCode module
vi.mock('../src/dockerCode.js', () => ({
  default: vi.fn().mockReturnValue('dockerfile content')
}));

// Mock the lambdaCode module
vi.mock('../src/lambdaCode.js', () => ({
  default: vi.fn().mockReturnValue('lambda content')
}));

// Mock console.log and console.warn
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Model Utilities', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
  });

  describe('getModelType', () => {
    it('should return the selected model type', async () => {
      // Execute
      const result = await modelUtils.getModelType();
      
      // Verify
      expect(result).toBe('pre-trained');
      expect(validation.optionToExitApp).toHaveBeenCalledWith('pre-trained');
    });
  });

  describe('getModelName', () => {
    it('should return the model name when valid', async () => {
      // Execute
      const result = await modelUtils.getModelName('/path/to/config');
      
      // Verify
      expect(result).toBe('test-model');
      expect(validation.validModelName).toHaveBeenCalledWith('test-model', '/path/to/config');
    });
  });

  describe('generateModelFiles', () => {
    it('should call writeModelFiles with correct parameters', () => {
      // Setup
      const writeModelFilesSpy = vi.spyOn(fileSystem, 'writeModelFiles');
      
      // Execute
      modelUtils.generateModelFiles('pre-trained', 'model-name', '/model/dir', 'test description');
      
      // Verify
      expect(writeModelFilesSpy).toHaveBeenCalledWith(
        '/model/dir',
        expect.any(String),
        expect.any(String),
        expect.any(String),
        'test description'
      );
    });
  });
});
