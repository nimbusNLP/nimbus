/**
 * Tests for CLI interaction functions in the Nimbus CLI
 */

// Mock dependencies
jest.mock('@clack/prompts');
jest.mock('../src/utils/fileSystem.js', () => ({
  readModelsConfig: jest.fn()
}));
jest.mock('../src/utils/validation.js', () => ({
  optionToExitApp: jest.fn()
}));

// Import functions to test
const { shouldDeployModel, shouldRemoveModel, selectModelToRemove, shouldDestroyStack } = require('../src/utils/cli.js');
const { select, note } = require('@clack/prompts');
const { readModelsConfig } = require('../src/utils/fileSystem.js');
const { optionToExitApp } = require('../src/utils/validation.js');

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`Process.exit called with code: ${code}`);
});

// Mock console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('CLI Interaction Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shouldDeployModel', () => {
    test('should return true when user selects "yes"', async () => {
      // Setup mock to return "yes"
      select.mockResolvedValue('yes');
      
      const result = await shouldDeployModel();
      
      expect(select).toHaveBeenCalledWith({
        message: 'Are you ready to deploy a model?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      });
      expect(optionToExitApp).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('should exit when user selects "no"', async () => {
      // Setup mock to return "no"
      select.mockResolvedValue('no');
      
      try {
        await shouldDeployModel();
        // If we get here, the test should fail
        fail('Should have exited');
      } catch (error) {
        expect(error.message).toBe('Process.exit called with code: 0');
      }
      
      expect(select).toHaveBeenCalled();
      expect(optionToExitApp).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('No model deployed.');
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('shouldRemoveModel', () => {
    test('should exit when user selects "no"', async () => {
      // Setup mock to return "no"
      select.mockResolvedValue('no');
      
      try {
        await shouldRemoveModel('test-model');
        // If we get here, the test should fail
        fail('Should have exited');
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
      expect(optionToExitApp).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('No model removed.');
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    test('should continue when user selects "yes"', async () => {
      // Setup mock to return "yes"
      select.mockResolvedValue('yes');
      
      await shouldRemoveModel('test-model');
      
      expect(select).toHaveBeenCalled();
      expect(optionToExitApp).toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });
  });

  describe('selectModelToRemove', () => {
    test('should exit when no models are found', async () => {
      // Setup mock to return an empty array
      readModelsConfig.mockReturnValue([]);
      
      try {
        await selectModelToRemove('config-path');
        // If we get here, the test should fail
        fail('Should have exited');
      } catch (error) {
        expect(error.message).toBe('Process.exit called with code: 0');
      }
      
      expect(readModelsConfig).toHaveBeenCalledWith('config-path');
      expect(note).toHaveBeenCalledWith('No models found in configuration to remove.', 'Error');
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    test('should return the selected model name', async () => {
      // Setup mock data
      const mockModels = [
        { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model1' },
        { modelName: 'model2', modelType: 'fine-tuned', description: 'A fine-tuned model' }
      ];
      
      readModelsConfig.mockReturnValue(mockModels);
      select.mockResolvedValue('model2');
      
      const result = await selectModelToRemove('config-path');
      
      expect(readModelsConfig).toHaveBeenCalledWith('config-path');
      expect(select).toHaveBeenCalledWith({
        message: 'Which model would you like to remove?',
        options: [
          { value: 'model1', label: 'model1 (pre-trained)', hint: '/path/to/model1' },
          { value: 'model2', label: 'model2 (fine-tuned)', hint: 'A fine-tuned model' }
        ],
      });
      expect(optionToExitApp).toHaveBeenCalled();
      expect(result).toBe('model2');
    });
  });

  describe('shouldDestroyStack', () => {
    test('should exit when user selects "no"', async () => {
      // Setup mock to return "no"
      select.mockResolvedValue('no');
      
      try {
        await shouldDestroyStack();
        // If we get here, the test should fail
        fail('Should have exited');
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
      expect(optionToExitApp).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Stack not destroyed.');
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    test('should continue when user selects "yes"', async () => {
      // Setup mock to return "yes"
      select.mockResolvedValue('yes');
      
      await shouldDestroyStack();
      
      expect(select).toHaveBeenCalled();
      expect(optionToExitApp).toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
