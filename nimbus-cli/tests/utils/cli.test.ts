import { jest } from '@jest/globals';

// Mock the dependencies
jest.mock('@clack/prompts', () => ({
  select: jest.fn(),
  note: jest.fn()
}));

jest.mock('../../src/utils/fileSystem.js', () => ({
  readModelsConfig: jest.fn()
}));

// Import the mocked modules
import { select, note } from '@clack/prompts';
import { readModelsConfig } from '../../src/utils/fileSystem.js';

// Mock process.exit to prevent tests from actually exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`Process.exit called with code: ${code}`);
});

// Mock console.log to prevent output during tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

// Import the functions to test after mocking
import { shouldDeployModel, shouldRemoveModel, selectModelToRemove, shouldDestroyStack } from '../../src/utils/cli.js';

describe('CLI Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('shouldDeployModel', () => {
    it('should return true when user selects "yes"', async () => {
      // Setup the mock to return "yes"
      (select as unknown as jest.Mock).mockResolvedValue('yes');
      
      const result = await shouldDeployModel();
      
      expect(select).toHaveBeenCalledWith({
        message: 'Are you ready to deploy a model?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      });
      expect(result).toBe(true);
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should exit when user selects "no"', async () => {
      // Setup the mock to return "no"
      (select as unknown as jest.Mock).mockResolvedValue('no');
      
      try {
        await shouldDeployModel();
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Process.exit called with code: 0');
      }
      
      expect(console.log).toHaveBeenCalledWith('No model deployed.');
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('shouldRemoveModel', () => {
    it('should exit when user selects "no"', async () => {
      // Setup the mock to return "no"
      (select as unknown as jest.Mock).mockResolvedValue('no');
      
      try {
        await shouldRemoveModel('test-model');
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Process.exit called with code: 0');
      }
      
      expect(select).toHaveBeenCalledWith({
        message: 'Are you sure you want to remove the model "test-model"? This will delete its cloud resources.',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      });
      expect(console.log).toHaveBeenCalledWith('No model removed.');
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('should continue when user selects "yes"', async () => {
      // Setup the mock to return "yes"
      (select as unknown as jest.Mock).mockResolvedValue('yes');
      
      await shouldRemoveModel('test-model');
      
      expect(process.exit).not.toHaveBeenCalled();
    });
  });

  describe('selectModelToRemove', () => {
    it('should exit when no models are found', async () => {
      // Setup the mock to return an empty array
      (readModelsConfig as jest.Mock).mockReturnValue([]);
      
      try {
        await selectModelToRemove('config-path');
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Process.exit called with code: 0');
      }
      
      expect(note).toHaveBeenCalledWith('No models found in configuration to remove.', 'Error');
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('should return the selected model name', async () => {
      // Setup mock data
      const mockModels = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1' },
        { modelName: 'model2', modelType: 'fine-tuned', description: 'A fine-tuned model' }
      ];
      
      (readModelsConfig as jest.Mock).mockReturnValue(mockModels);
      (select as unknown as jest.Mock).mockResolvedValue('model2');
      
      const result = await selectModelToRemove('config-path');
      
      expect(readModelsConfig).toHaveBeenCalledWith('config-path');
      expect(select).toHaveBeenCalledWith({
        message: 'Which model would you like to remove?',
        options: [
          { value: 'model1', label: 'model1 (pre-trained)', hint: '/path/to/model1' },
          { value: 'model2', label: 'model2 (fine-tuned)', hint: 'A fine-tuned model' }
        ],
      });
      expect(result).toBe('model2');
    });
  });

  describe('shouldDestroyStack', () => {
    it('should exit when user selects "no"', async () => {
      // Setup the mock to return "no"
      (select as unknown as jest.Mock).mockResolvedValue('no');
      
      try {
        await shouldDestroyStack();
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Process.exit called with code: 0');
      }
      
      expect(select).toHaveBeenCalledWith({
        message: 'Are you sure you want to destroy the stack? This will delete all deployed AWS resources.',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      });
      expect(console.log).toHaveBeenCalledWith('Stack not destroyed.');
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('should continue when user selects "yes"', async () => {
      // Setup the mock to return "yes"
      (select as unknown as jest.Mock).mockResolvedValue('yes');
      
      await shouldDestroyStack();
      
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
