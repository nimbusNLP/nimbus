/**
 * Tests for CLI utility functions
 * 
 * This demonstrates how to test functions that use @clack/prompts
 * without running into TypeScript issues
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @clack/prompts module
vi.mock('@clack/prompts', () => ({
  select: vi.fn(),
  note: vi.fn(),
  isCancel: vi.fn(),
  cancel: vi.fn()
}));

// Import the mocked module
import { select, note, isCancel } from '@clack/prompts';

// Mock process.exit to prevent tests from actually exiting
const mockExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`process.exit unexpectedly called with code: ${code}`);
});

// Mock console.log to prevent output during tests
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

// Mock the fileSystem module
vi.mock('../src/utils/fileSystem.js', () => ({
  readModelsConfig: vi.fn(() => [])
}));

// Import the function to test
import { shouldDeployModel } from '../src/utils/cli.js';

describe('CLI Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('shouldDeployModel', () => {
    it('should return true when user selects "yes"', async () => {
      // Setup the mock to return "yes"
      vi.mocked(select).mockResolvedValue('yes');
      
      const result = await shouldDeployModel();
      
      expect(select).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
