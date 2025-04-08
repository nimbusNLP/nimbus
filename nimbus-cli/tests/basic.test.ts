/**
 * Basic test file to demonstrate testing in the Nimbus CLI using Vitest
 */

// Import Vitest testing functions
import { describe, test, expect } from 'vitest';

// Simple tests that don't require any imports or mocks
describe('Basic Tests', () => {
  test('true should be true', () => {
    expect(true).toBe(true);
  });

  test('addition works correctly', () => {
    expect(1 + 1).toBe(2);
  });

  test('string concatenation works', () => {
    expect('hello ' + 'world').toBe('hello world');
  });
});
