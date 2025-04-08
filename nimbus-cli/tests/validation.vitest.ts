/**
 * Vitest version of validation tests
 * This shows how your TypeScript tests would work with Vitest
 */

// With Vitest, you can use ES modules and TypeScript directly
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isSafeDescription, validModelName, modelNameNotUnique, optionToExitApp } from '../src/utils/validation.js';

// Mock dependencies
vi.mock('../src/utils/fileSystem.js', () => ({
  readModelsConfig: vi.fn().mockImplementation(() => [
    { modelName: 'existingModel' },
    { modelName: 'anotherModel' }
  ])
}));

vi.mock('@clack/prompts', () => ({
  isCancel: vi.fn().mockImplementation((input) => input === Symbol.for('clack/cancel')),
  cancel: vi.fn()
}));

describe('Validation Functions', () => {
  describe('isSafeDescription', () => {
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

    it('should return false for descriptions with dangerous shell characters', () => {
      expect(isSafeDescription('Description with $ char')).toBe(false);
      expect(isSafeDescription('Description with ` char')).toBe(false);
      expect(isSafeDescription('Description with ; char')).toBe(false);
    });

    it('should return false for descriptions longer than 200 characters', () => {
      const longDescription = 'a'.repeat(201);
      expect(isSafeDescription(longDescription)).toBe(false);
    });
    
    it('should handle undefined', () => {
      expect(isSafeDescription(undefined)).toBe(true);
    });
  });
  
  describe('validModelName', () => {
    it('should return true for valid model names', () => {
      expect(validModelName('validmodel', '/path/to/config')).toBe(true);
      expect(validModelName('model123', '/path/to/config')).toBe(true);
      expect(validModelName('a123456789', '/path/to/config')).toBe(true);
    });
    
    it('should return false for invalid model names', () => {
      expect(validModelName('', '/path/to/config')).toBe(false);
      expect(validModelName('   ', '/path/to/config')).toBe(false);
      expect(validModelName('123model', '/path/to/config')).toBe(false);
      expect(validModelName('Model', '/path/to/config')).toBe(false);
      expect(validModelName('model-name', '/path/to/config')).toBe(false);
      expect(validModelName('model_name', '/path/to/config')).toBe(false);
    });
    
    it('should return false for non-string inputs', () => {
      expect(validModelName(123 as any, '/path/to/config')).toBe(false);
      expect(validModelName(null as any, '/path/to/config')).toBe(false);
      expect(validModelName(undefined as any, '/path/to/config')).toBe(false);
      expect(validModelName(Symbol('test'), '/path/to/config')).toBe(false);
    });
    
    it('should return false for existing model names', () => {
      expect(validModelName('existingModel', '/path/to/config')).toBe(false);
      expect(validModelName('anotherModel', '/path/to/config')).toBe(false);
    });
  });
  
  describe('modelNameNotUnique', () => {
    it('should return true for existing model names', () => {
      expect(modelNameNotUnique('existingModel', '/path/to/config')).toBe(true);
      expect(modelNameNotUnique('anotherModel', '/path/to/config')).toBe(true);
    });
    
    it('should return false for new model names', () => {
      expect(modelNameNotUnique('newModel', '/path/to/config')).toBe(false);
      expect(modelNameNotUnique('uniqueModel', '/path/to/config')).toBe(false);
    });
  });
  
  describe('optionToExitApp', () => {
    const originalExit = process.exit;
    
    beforeEach(() => {
      process.exit = vi.fn() as any;
    });
    
    afterEach(() => {
      process.exit = originalExit;
    });
    
    it('should exit when cancel symbol is provided', () => {
      const cancelSymbol = Symbol.for('clack/cancel');
      optionToExitApp(cancelSymbol);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
    
    it('should not exit for normal input', () => {
      optionToExitApp('normal input');
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
