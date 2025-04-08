/**
 * Tests for the simplified validation utilities
 */

// Import the functions to test
const { 
  validModelName, 
  modelNameNotUnique, 
  isSafeDescription, 
  optionToExitApp 
} = require('./utils/validation-utils');

describe('Validation Utilities', () => {
  describe('isSafeDescription', () => {
    test('should return true for empty string', () => {
      expect(isSafeDescription('')).toBe(true);
    });

    test('should return true for valid descriptions', () => {
      expect(isSafeDescription('A valid description')).toBe(true);
      expect(isSafeDescription('Description with numbers 123')).toBe(true);
      expect(isSafeDescription('Description with symbols !@#%&*()[]{}.,?')).toBe(true);
    });

    test('should return false for descriptions with HTML tags', () => {
      expect(isSafeDescription('Description with <tag>')).toBe(false);
      expect(isSafeDescription('Description with </tag>')).toBe(false);
    });

    test('should return false for descriptions with dangerous shell characters', () => {
      expect(isSafeDescription('Description with $ char')).toBe(false);
      expect(isSafeDescription('Description with ` char')).toBe(false);
      expect(isSafeDescription('Description with ; char')).toBe(false);
    });

    test('should return false for descriptions longer than 200 characters', () => {
      const longDescription = 'a'.repeat(201);
      expect(isSafeDescription(longDescription)).toBe(false);
    });
    
    test('should handle undefined', () => {
      expect(isSafeDescription(undefined)).toBe(true);
    });
  });
  
  describe('validModelName', () => {
    test('should return true for valid model names', () => {
      expect(validModelName('validmodel', '/path/to/config')).toBe(true);
      expect(validModelName('model123', '/path/to/config')).toBe(true);
      expect(validModelName('a123456789', '/path/to/config')).toBe(true);
    });
    
    test('should return false for invalid model names', () => {
      expect(validModelName('', '/path/to/config')).toBe(false);
      expect(validModelName('   ', '/path/to/config')).toBe(false);
      expect(validModelName('123model', '/path/to/config')).toBe(false);
      expect(validModelName('Model', '/path/to/config')).toBe(false);
      expect(validModelName('model-name', '/path/to/config')).toBe(false);
      expect(validModelName('model_name', '/path/to/config')).toBe(false);
    });
    
    test('should return false for non-string inputs', () => {
      expect(validModelName(123, '/path/to/config')).toBe(false);
      expect(validModelName(null, '/path/to/config')).toBe(false);
      expect(validModelName(undefined, '/path/to/config')).toBe(false);
    });
    
    test('should return false for existing model names', () => {
      expect(validModelName('existingModel', '/path/to/config')).toBe(false);
      expect(validModelName('anotherModel', '/path/to/config')).toBe(false);
    });
  });
  
  describe('modelNameNotUnique', () => {
    test('should return true for existing model names', () => {
      expect(modelNameNotUnique('existingModel', '/path/to/config')).toBe(true);
      expect(modelNameNotUnique('anotherModel', '/path/to/config')).toBe(true);
    });
    
    test('should return false for new model names', () => {
      expect(modelNameNotUnique('newModel', '/path/to/config')).toBe(false);
      expect(modelNameNotUnique('uniqueModel', '/path/to/config')).toBe(false);
    });
  });
  
  describe('optionToExitApp', () => {
    const originalExit = process.exit;
    
    beforeEach(() => {
      process.exit = jest.fn();
    });
    
    afterEach(() => {
      process.exit = originalExit;
    });
    
    test('should exit when cancel symbol is provided', () => {
      const cancelSymbol = Symbol.for('clack/cancel');
      optionToExitApp(cancelSymbol);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
    
    test('should not exit for normal input', () => {
      optionToExitApp('normal input');
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
