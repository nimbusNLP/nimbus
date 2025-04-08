/**
 * Basic Vitest tests to verify the testing setup is working
 */

import { describe, it, expect } from 'vitest';

describe('Basic Tests', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    expect('hello').toContain('ell');
    expect('hello'.length).toBe(5);
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should handle objects', () => {
    const obj = { name: 'nimbus', type: 'cli' };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('nimbus');
  });
});
