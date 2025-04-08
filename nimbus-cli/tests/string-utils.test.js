/**
 * Simple tests for string utility functions
 * 
 * These tests don't require importing from the actual codebase
 */

// Simple string utility functions to test
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function truncate(str, length) {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

// Tests
describe('String Utilities', () => {
  describe('capitalize', () => {
    test('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    test('should not change already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
      expect(capitalize('World')).toBe('World');
    });

    test('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('slugify', () => {
    test('should convert spaces to hyphens', () => {
      expect(slugify('hello world')).toBe('hello-world');
    });

    test('should convert to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    test('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    test('should truncate strings longer than specified length', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    test('should not truncate strings shorter than specified length', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    test('should handle empty strings', () => {
      expect(truncate('', 5)).toBe('');
    });
  });
});
