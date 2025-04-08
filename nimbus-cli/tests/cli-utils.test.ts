/**
 * Tests for CLI utility functions
 * 
 * This demonstrates how to test functions that use @clack/prompts
 * without running into TypeScript issues
 */

import { jest } from '@jest/globals';

// Mock @clack/prompts module
jest.mock('@clack/prompts', () => ({
  select: jest.fn(),
  note: jest.fn(),
  isCancel: jest.fn(),
  cancel: jest.fn()
}));

// Import the mocked module
import { select, note, isCancel } from '@clack/prompts';

// Mock process.exit to prevent tests from actually exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`Process.exit called with code: ${code}`);
});

// Mock console.log to prevent output during tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

// Mock the fileSystem module
jest.mock('../src/utils/fileSystem.js', () => ({
  readModelsConfig: jest.fn(() => [])
}));

// Import the function to test
import { shouldDeployModel } from '../src/utils/cli.js';

describe('CLI Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('shouldDeployModel', () => {
    it('should return true when user selects "yes"', async () => {
      // Setup the mock to return "yes"
      (select as jest.MockedFunction<any>).mockResolvedValue('yes');
      
      const result = await shouldDeployModel();
      
      expect(select).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should exit when user selects "no"', async () => {
      // Setup the mock to return "no"
      (select as jest.MockedFunction<any>).mockResolvedValue('no');
      
      try {
        await shouldDeployModel();
        // If we get here, the test should fail
        fail('Should have exited');
      } catch (error: any) {
        expect(error.message).toBe('Process.exit called with code: 0');
      }
      
      expect(console.log).toHaveBeenCalledWith('No model deployed.');
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });
});
