/**
 * Simple tests for validation functions in the Nimbus CLI
 * 
 * These tests don't require complex mocking or TypeScript
 */

// Import the function to test
import { isSafeDescription } from '../src/utils/validation.js';

describe('Validation Functions', () => {
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
  });
});
